import 'server-only';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { OIDCProvider, VO } from '@/lib/core/entity/auth-models';
import { InvalidConfig } from '@/lib/core/exceptions/env-config-exceptions';
import { clientEnvSchema } from './env.client';
import {
    csvList,
    envBoolean,
    formatEnvIssues,
    optionalString,
    optionalUrl,
    requiredString,
    requiredUrl,
    stringWithDefault,
    urlWithDefault,
} from './env-schema-helpers';

/**
 * Server side configuration of the WebUI, validated with Zod.
 *
 * This is the single place that reads configuration from the environment. Everything is read when the
 * server starts (see `src/instrumentation.ts`), never at build time, so a single build can be configured
 * per deployment. During `next build` missing values are replaced by placeholders so the image can be
 * built without any deployment configuration.
 *
 * Feature flags (`FEATURE_*`) are owned by the feature registry in `@/lib/core/entity/feature-config`.
 */
export const serverEnvSchema = clientEnvSchema
    .extend({
        // Rucio servers
        RUCIO_HOST: requiredUrl,
        RUCIO_AUTH_HOST: requiredUrl,
        PARAMS_ENCODING_ENABLED: envBoolean(false),

        // Auth.js
        NEXTAUTH_URL: optionalUrl,
        NEXTAUTH_SECRET: optionalString,
        AUTH_SECRET: optionalString,

        // Login methods
        ENABLE_USERPASS_LOGIN: envBoolean(true),
        X509_ENABLED: envBoolean(true),

        // OIDC, see the OIDC_PROVIDER_<NAME>_* variables below
        OIDC_ENABLED: envBoolean(false),
        OIDC_PROVIDERS: csvList(),
        OIDC_EXPECTED_AUDIENCE_CLAIM: stringWithDefault('rucio'),

        // Multi VO, see the VO_<NAME>_* variables below
        MULTIVO_ENABLED: envBoolean(false),
        VO_DEFAULT: stringWithDefault('def'),
        VO_LIST: csvList(['def']),

        // TLS towards the Rucio servers. The CA bundle itself is loaded by node via NODE_EXTRA_CA_CERTS.
        NODE_TLS_REJECT_UNAUTHORIZED: z.preprocess(
            value => (value === '' ? undefined : value),
            z.enum(['0', '1'], { error: 'must be 0 or 1' }).optional(),
        ),
        SERVER_CA_BUNDLE: optionalString,
        NODE_EXTRA_CA_CERTS: optionalString,

        // Misc
        PROJECT_URL: optionalString,
        RULE_ACTIVITY: stringWithDefault('User Subscriptions'),
        LIST_DIDS_INITIAL_PATTERN: optionalString,

        // External integrations
        FEATURE_DDM_DASHBOARD: envBoolean(false),
        DDM_DASHBOARD_BASE_URL: optionalUrl,
        AMI_BASE_URL: urlWithDefault('https://atlas-ami.cern.ch'),
        PANDA_BASE_URL: urlWithDefault('https://bigpanda.cern.ch'),

        // Development helpers
        DEV_SHORT_SESSION_SECONDS: z.preprocess(value => (value === '' ? undefined : value), z.coerce.number().int().positive().optional()),
        DEV_FORCE_REFRESH_FAIL: envBoolean(false),
    })
    .superRefine((env, ctx) => {
        if (!env.NEXTAUTH_SECRET && !env.AUTH_SECRET) {
            ctx.addIssue({ code: 'custom', path: ['NEXTAUTH_SECRET'], message: 'NEXTAUTH_SECRET or AUTH_SECRET is required' });
        }
        if (env.NODE_TLS_REJECT_UNAUTHORIZED === '1' && !env.SERVER_CA_BUNDLE && !env.NODE_EXTRA_CA_CERTS) {
            ctx.addIssue({
                code: 'custom',
                path: ['SERVER_CA_BUNDLE'],
                message: 'SERVER_CA_BUNDLE (or NODE_EXTRA_CA_CERTS) is required when NODE_TLS_REJECT_UNAUTHORIZED=1',
            });
        }
        if (env.OIDC_ENABLED && env.OIDC_PROVIDERS.length === 0) {
            ctx.addIssue({ code: 'custom', path: ['OIDC_PROVIDERS'], message: 'is required when OIDC_ENABLED=true' });
        }
        if (env.FEATURE_DDM_DASHBOARD && !env.DDM_DASHBOARD_BASE_URL) {
            ctx.addIssue({ code: 'custom', path: ['DDM_DASHBOARD_BASE_URL'], message: 'is required when FEATURE_DDM_DASHBOARD=true' });
        }
    });

/**
 * Variables of one OIDC provider, read from `OIDC_PROVIDER_<NAME>_<FIELD>`.
 */
const oidcProviderEnvSchema = z.object({
    CLIENT_ID: requiredString,
    CLIENT_SECRET: requiredString,
    AUTHORIZATION_URL: requiredUrl,
    TOKEN_URL: requiredUrl,
    REDIRECT_URL: requiredUrl,
    ISSUER: optionalUrl,
    URL: optionalString,
    ICON_URL: optionalString,
    REFRESH_TOKEN_URL: optionalUrl,
    USERINFO_URL: optionalUrl,
    SCOPES: csvList(),
    LOGOUT_URL: optionalUrl,
});

/**
 * Variables of one VO, read from `VO_<NAME>_<FIELD>`. `LOGO` and `LOGO_URL` are both accepted.
 */
const voEnvSchema = z
    .object({
        NAME: requiredString,
        LOGO: optionalString,
        LOGO_URL: optionalString,
        OIDC_ENABLED: envBoolean(false),
        OIDC_PROVIDERS: csvList(),
    })
    .superRefine((vo, ctx) => {
        if (vo.OIDC_ENABLED && vo.OIDC_PROVIDERS.length === 0) {
            ctx.addIssue({ code: 'custom', path: ['OIDC_PROVIDERS'], message: 'is required when OIDC_ENABLED=true' });
        }
    });

type BaseServerEnv = z.output<typeof serverEnvSchema>;

export type ServerEnv = Omit<BaseServerEnv, 'NEXTAUTH_SECRET'> & {
    /** NEXTAUTH_SECRET, or AUTH_SECRET when only that one is set. */
    NEXTAUTH_SECRET: string;
    /** Providers listed in OIDC_PROVIDERS. Empty when OIDC is disabled. */
    oidcProviders: OIDCProvider[];
    /** VOs listed in VO_LIST, or the single default VO when multi VO is disabled. */
    voList: VO[];
};

export type EnvSource = Record<string, string | undefined>;

/**
 * Values used for anything missing or invalid while `next build` runs. Nothing is prerendered from
 * them: every route reads its configuration at request time.
 */
const BUILD_TIME_PLACEHOLDERS: EnvSource = {
    RUCIO_HOST: 'https://rucio-host.build-placeholder.invalid',
    RUCIO_AUTH_HOST: 'https://rucio-auth-host.build-placeholder.invalid',
    NEXTAUTH_SECRET: 'build-time-placeholder',
};

export function isBuildPhase(source: EnvSource): boolean {
    return source.NEXT_PHASE === 'phase-production-build';
}

/**
 * Reads `<prefix>_<KEY>` for each key, falling back to the upper-cased prefix (`cern` → `CERN`).
 */
function readPrefixed(source: EnvSource, prefix: string, keys: string[]): EnvSource {
    return Object.fromEntries(keys.map(key => [key, source[`${prefix}_${key}`] ?? source[`${prefix.toUpperCase()}_${key}`]]));
}

/**
 * Re-labels issues from a sub-schema with the full variable name, e.g. `OIDC_PROVIDER_CERN_TOKEN_URL`.
 */
function prefixIssues(issues: z.core.$ZodIssue[], prefix: string): z.core.$ZodIssue[] {
    return issues.map(issue => ({ ...issue, path: [`${prefix.toUpperCase()}_${issue.path.map(String).join('_')}`] }));
}

/**
 * OIDC provider icons are downloaded into public/oidc-icons/<NAME>.png by the container entrypoint
 * so they can be served through next/image. The local path is only exposed when the file exists;
 * a missing or failed download degrades to the default icon.
 */
function resolveLocalOIDCIconUrl(providerName: string, configuredIconUrl: string | undefined): string | null {
    if (!configuredIconUrl) {
        return null;
    }
    const fileName = `${providerName.toUpperCase()}.png`;
    const filePath = path.join(process.cwd(), 'public', 'oidc-icons', fileName);
    return fs.existsSync(filePath) ? `/oidc-icons/${fileName}` : null;
}

function parseOIDCProviders(source: EnvSource, env: BaseServerEnv, issues: z.core.$ZodIssue[]): OIDCProvider[] {
    if (!env.OIDC_ENABLED) {
        return [];
    }
    const keys = Object.keys(oidcProviderEnvSchema.shape);
    return env.OIDC_PROVIDERS.flatMap(name => {
        const prefix = `OIDC_PROVIDER_${name}`;
        const result = oidcProviderEnvSchema.safeParse(readPrefixed(source, prefix, keys));
        if (!result.success) {
            issues.push(...prefixIssues(result.error.issues, prefix));
            return [];
        }
        const config = result.data;
        return [
            {
                name,
                url: config.URL,
                iconUrl: resolveLocalOIDCIconUrl(name, config.ICON_URL),
                clientId: config.CLIENT_ID,
                clientSecret: config.CLIENT_SECRET,
                authorizationUrl: config.AUTHORIZATION_URL,
                tokenUrl: config.TOKEN_URL,
                redirectUrl: config.REDIRECT_URL,
                refreshTokenUrl: config.REFRESH_TOKEN_URL,
                userInfoUrl: config.USERINFO_URL,
                scopes: config.SCOPES.length > 0 ? config.SCOPES : undefined,
                issuer: config.ISSUER,
            },
        ];
    });
}

function parseVOs(source: EnvSource, env: BaseServerEnv, oidcProviders: OIDCProvider[], issues: z.core.$ZodIssue[]): VO[] {
    if (!env.MULTIVO_ENABLED) {
        // A single default VO that follows the global OIDC settings
        return [{ name: 'default', shortName: 'def', logoUrl: '', oidcEnabled: env.OIDC_ENABLED, oidcProviders }];
    }
    const keys = ['NAME', 'LOGO', 'LOGO_URL', 'OIDC_ENABLED', 'OIDC_PROVIDERS'];
    return env.VO_LIST.flatMap(shortName => {
        const prefix = `VO_${shortName}`;
        const result = voEnvSchema.safeParse(readPrefixed(source, prefix, keys));
        if (!result.success) {
            issues.push(...prefixIssues(result.error.issues, prefix));
            return [];
        }
        const config = result.data;
        const voProviders: OIDCProvider[] = [];
        if (config.OIDC_ENABLED) {
            for (const providerName of config.OIDC_PROVIDERS) {
                const provider = oidcProviders.find(candidate => candidate.name.toLowerCase() === providerName.toLowerCase());
                if (!provider) {
                    issues.push({
                        code: 'custom',
                        path: [`${prefix.toUpperCase()}_OIDC_PROVIDERS`],
                        message: `OIDC provider "${providerName}" is not configured in OIDC_PROVIDERS (or OIDC_ENABLED is false)`,
                    });
                    continue;
                }
                voProviders.push(provider);
            }
        }
        return [
            {
                shortName,
                name: config.NAME,
                logoUrl: config.LOGO_URL ?? config.LOGO ?? '',
                oidcEnabled: config.OIDC_ENABLED,
                oidcProviders: voProviders,
            },
        ];
    });
}

type ParseResult = { success: true; env: ServerEnv } | { success: false; issues: z.core.$ZodIssue[] };

function tryParse(source: EnvSource): ParseResult {
    // MULTI_VO_ENABLED is the spelling the old env-generator used
    const input = { ...source, MULTIVO_ENABLED: source.MULTIVO_ENABLED ?? source.MULTI_VO_ENABLED };
    const result = serverEnvSchema.safeParse(input);
    if (!result.success) {
        return { success: false, issues: result.error.issues };
    }
    const base = result.data;
    const issues: z.core.$ZodIssue[] = [];
    const oidcProviders = parseOIDCProviders(source, base, issues);
    const voList = parseVOs(source, base, oidcProviders, issues);
    if (issues.length > 0) {
        return { success: false, issues };
    }
    return {
        success: true,
        env: { ...base, NEXTAUTH_SECRET: (base.NEXTAUTH_SECRET ?? base.AUTH_SECRET) as string, oidcProviders, voList },
    };
}

/**
 * Validates the given environment. Throws {@link InvalidConfig} listing every problem, except during
 * `next build` where it warns and falls back to placeholders.
 */
export function parseServerEnv(source: EnvSource): ServerEnv {
    const result = tryParse(source);
    if (result.success) {
        return result.env;
    }
    if (isBuildPhase(source)) {
        console.warn(
            '[env] Using build-time placeholders, the configuration is validated again when the server starts:\n' + formatEnvIssues(result.issues),
        );
        const placeholder = tryParse(BUILD_TIME_PLACEHOLDERS);
        if (!placeholder.success) {
            throw new InvalidConfig(`Build-time placeholder configuration is invalid:\n${formatEnvIssues(placeholder.issues)}`);
        }
        return placeholder.env;
    }
    throw new InvalidConfig(`Invalid WebUI configuration:\n${formatEnvIssues(result.issues)}`);
}

let cachedEnv: ServerEnv | undefined;

/**
 * The validated server configuration. Parsed once per process; tests re-read the environment on every
 * call because they change process.env between cases.
 */
export function getServerEnv(): ServerEnv {
    if (process.env.NODE_ENV === 'test') {
        return parseServerEnv(process.env);
    }
    cachedEnv ??= parseServerEnv(process.env);
    return cachedEnv;
}
