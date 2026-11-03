import { InvalidConfig } from '@/lib/core/exceptions/env-config-exceptions';
import { getServerEnv, parseServerEnv, EnvSource } from '@/lib/infrastructure/config/env.server';
import { getRuntimeConfig } from '@/lib/infrastructure/config/runtime-config';
import { createOIDCProviders, deleteOIDCProviders } from 'test/fixtures/oidc-provider-config';
import fs from 'fs';
import path from 'path';

const MINIMAL: EnvSource = {
    RUCIO_HOST: 'https://rucio-host.com',
    RUCIO_AUTH_HOST: 'https://rucio-auth-host.com',
    NEXTAUTH_SECRET: 'secret',
};

const parse = (extra: EnvSource = {}) => parseServerEnv({ ...MINIMAL, ...extra });

const MULTI_VO: EnvSource = {
    MULTIVO_ENABLED: 'true',
    VO_LIST: 'def, atl',
    VO_DEF_NAME: 'Default',
    VO_DEF_LOGO_URL: 'https://example.com/def.png',
    VO_ATL_NAME: 'ATLAS',
    VO_ATL_LOGO: 'https://example.com/atl.png',
};

describe('server env defaults and parsing', () => {
    it('applies the defaults for a minimal configuration', () => {
        const env = parse();
        expect(env.RUCIO_HOST).toBe('https://rucio-host.com');
        expect(env.X509_ENABLED).toBe(true);
        expect(env.ENABLE_USERPASS_LOGIN).toBe(true);
        expect(env.OIDC_ENABLED).toBe(false);
        expect(env.OIDC_EXPECTED_AUDIENCE_CLAIM).toBe('rucio');
        expect(env.MULTIVO_ENABLED).toBe(false);
        expect(env.PARAMS_ENCODING_ENABLED).toBe(false);
        expect(env.RULE_ACTIVITY).toBe('User Subscriptions');
        expect(env.AMI_BASE_URL).toBe('https://atlas-ami.cern.ch');
        expect(env.PANDA_BASE_URL).toBe('https://bigpanda.cern.ch');
        expect(env.LIST_DIDS_INITIAL_PATTERN).toBeUndefined();
        expect(env.oidcProviders).toEqual([]);
    });

    it.each(['false', 'False', 'FALSE', '0', 'no', 'off'])('reads %p as false', value => {
        expect(parse({ X509_ENABLED: value }).X509_ENABLED).toBe(false);
    });

    it.each(['true', 'True', 'TRUE', '1', 'yes', ' on '])('reads %p as true', value => {
        expect(parse({ PARAMS_ENCODING_ENABLED: value }).PARAMS_ENCODING_ENABLED).toBe(true);
    });

    it('rejects a boolean it cannot understand instead of silently reading false', () => {
        expect(() => parse({ X509_ENABLED: 'maybe' })).toThrow('X509_ENABLED');
    });

    it('treats empty and blank strings as unset', () => {
        expect(parse({ LIST_DIDS_INITIAL_PATTERN: '' }).LIST_DIDS_INITIAL_PATTERN).toBeUndefined();
        expect(parse({ LIST_DIDS_INITIAL_PATTERN: '  ' }).LIST_DIDS_INITIAL_PATTERN).toBeUndefined();
        expect(parse({ OIDC_EXPECTED_AUDIENCE_CLAIM: ' ' }).OIDC_EXPECTED_AUDIENCE_CLAIM).toBe('rucio');
        expect(parse({ LIST_DIDS_INITIAL_PATTERN: 'scope:name' }).LIST_DIDS_INITIAL_PATTERN).toBe('scope:name');
    });

    it('falls back to AUTH_SECRET when NEXTAUTH_SECRET is not set', () => {
        const env = parseServerEnv({ ...MINIMAL, NEXTAUTH_SECRET: undefined, AUTH_SECRET: 'auth-secret' });
        expect(env.NEXTAUTH_SECRET).toBe('auth-secret');
    });
});

describe('server env validation', () => {
    it.each(['RUCIO_HOST', 'RUCIO_AUTH_HOST'])('requires %s', key => {
        expect(() => parse({ [key]: undefined })).toThrow(InvalidConfig);
        expect(() => parse({ [key]: '' })).toThrow(key);
        expect(() => parse({ [key]: 'not a url' })).toThrow('must be a valid URL');
    });

    it('requires a session secret', () => {
        expect(() => parseServerEnv({ ...MINIMAL, NEXTAUTH_SECRET: undefined })).toThrow('NEXTAUTH_SECRET or AUTH_SECRET is required');
    });

    it('requires a CA bundle when TLS verification is forced on', () => {
        expect(() => parse({ NODE_TLS_REJECT_UNAUTHORIZED: '1' })).toThrow('SERVER_CA_BUNDLE');
        expect(parse({ NODE_TLS_REJECT_UNAUTHORIZED: '1', SERVER_CA_BUNDLE: '/etc/ca.pem' }).SERVER_CA_BUNDLE).toBe('/etc/ca.pem');
        expect(parse({ NODE_TLS_REJECT_UNAUTHORIZED: '1', NODE_EXTRA_CA_CERTS: '/etc/ca.pem' }).NODE_EXTRA_CA_CERTS).toBe('/etc/ca.pem');
        expect(parse({ NODE_TLS_REJECT_UNAUTHORIZED: '0' }).NODE_TLS_REJECT_UNAUTHORIZED).toBe('0');
    });

    it('requires OIDC_PROVIDERS when OIDC is enabled', () => {
        expect(() => parse({ OIDC_ENABLED: 'true' })).toThrow('OIDC_PROVIDERS: is required when OIDC_ENABLED=true');
    });

    it('requires DDM_DASHBOARD_BASE_URL when the DDM dashboard is enabled', () => {
        expect(() => parse({ FEATURE_DDM_DASHBOARD: 'true' })).toThrow('DDM_DASHBOARD_BASE_URL');
        expect(parse({ FEATURE_DDM_DASHBOARD: 'true', DDM_DASHBOARD_BASE_URL: 'https://grafana.example.com/d/ddm' }).FEATURE_DDM_DASHBOARD).toBe(
            true,
        );
    });

    it.each([
        ['AMI_BASE_URL', 'FEATURE_DIDS_AMI_TAGS'],
        ['PANDA_BASE_URL', 'FEATURE_DIDS_PANDA_TASK'],
    ])('only validates %s when %s is enabled', (key, flag) => {
        expect(parse({ [key]: 'not a url' })[key as 'AMI_BASE_URL' | 'PANDA_BASE_URL']).toBe('not a url');
        expect(() => parse({ [key]: 'not a url', [flag]: 'true' })).toThrow(`${key}: must be a valid URL when ${flag} is enabled`);
        expect(() => parse({ [flag]: 'true' })).not.toThrow();
    });

    it('lists every problem in one error', () => {
        expect(() => parseServerEnv({ X509_ENABLED: 'maybe' })).toThrow(/RUCIO_HOST[\s\S]*RUCIO_AUTH_HOST[\s\S]*X509_ENABLED/);
    });
});

describe('server env build phase', () => {
    const consoleWarn = jest.spyOn(console, 'warn');

    beforeEach(() => consoleWarn.mockReset().mockImplementation(() => undefined));
    afterAll(() => consoleWarn.mockRestore());

    it('uses placeholders during next build instead of failing', () => {
        const env = parseServerEnv({ NEXT_PHASE: 'phase-production-build' });
        expect(env.RUCIO_HOST).toContain('build-placeholder');
        expect(env.NEXTAUTH_SECRET).toBe('build-time-placeholder');
        expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('RUCIO_HOST'));
    });

    it('keeps a valid configuration during next build', () => {
        const env = parseServerEnv({ ...MINIMAL, NEXT_PHASE: 'phase-production-build' });
        expect(env.RUCIO_HOST).toBe('https://rucio-host.com');
        expect(consoleWarn).not.toHaveBeenCalled();
    });

    it('fails outside of the build phase', () => {
        expect(() => parseServerEnv({ NEXT_PHASE: 'phase-production-server' })).toThrow(InvalidConfig);
    });
});

describe('server env OIDC providers', () => {
    beforeEach(() => createOIDCProviders());
    afterEach(() => {
        deleteOIDCProviders();
        jest.restoreAllMocks();
    });

    const parseProcessEnv = (extra: EnvSource = {}) => parseServerEnv({ ...process.env, ...extra });

    it('reads every provider from OIDC_PROVIDER_<NAME>_* variables', () => {
        const providers = parseProcessEnv().oidcProviders;
        expect(providers.map(provider => provider.name)).toEqual(['cern', 'test-provider']);
        const cern = providers[0];
        expect(cern.url).toEqual('https://cern.ch');
        // ICON_URL is set in the fixture, but no local file exists in the test env
        expect(cern.iconUrl).toBeNull();
        expect(cern.clientId).toEqual('client-id');
        expect(cern.clientSecret).toEqual('client-secret');
        expect(cern.scopes).toEqual(['scope1', 'scope2']);
        expect(cern.authorizationUrl).toEqual('https://cern.ch/auth');
        expect(cern.tokenUrl).toEqual('https://cern.ch/token');
        expect(cern.userInfoUrl).toEqual('https://cern.ch/userinfo');
        expect(cern.redirectUrl).toEqual('https://cern.ch/redirect');
        expect(cern.refreshTokenUrl).toEqual('https://cern.ch/userinfo');
    });

    it('returns no providers when OIDC is disabled', () => {
        expect(parseProcessEnv({ OIDC_ENABLED: 'false' }).oidcProviders).toEqual([]);
    });

    it('exposes the local icon path when the downloaded file exists', () => {
        jest.spyOn(fs, 'existsSync').mockImplementation(p => String(p) === path.join(process.cwd(), 'public', 'oidc-icons', 'CERN.png'));
        const providers = parseProcessEnv().oidcProviders;
        expect(providers[0].iconUrl).toEqual('/oidc-icons/CERN.png');
        expect(providers[1].iconUrl).toBeNull();
    });

    it('returns a null icon when ICON_URL is not configured', () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        expect(parseProcessEnv({ OIDC_PROVIDER_CERN_ICON_URL: undefined }).oidcProviders[0].iconUrl).toBeNull();
    });

    it('does not require the optional provider URL', () => {
        expect(parseProcessEnv({ OIDC_PROVIDER_CERN_URL: undefined }).oidcProviders[0].url).toBeUndefined();
    });

    it('names the missing provider variable', () => {
        expect(() => parseProcessEnv({ OIDC_PROVIDER_CERN_AUTHORIZATION_URL: undefined })).toThrow(
            'OIDC_PROVIDER_CERN_AUTHORIZATION_URL: is required',
        );
    });
});

describe('server env multi VO', () => {
    it('returns a single default VO that follows the global OIDC settings when multi VO is disabled', () => {
        expect(parse().voList).toEqual([{ name: 'default', shortName: 'def', logoUrl: '', oidcEnabled: false, oidcProviders: [] }]);
    });

    it('reads every VO from VO_<NAME>_* variables', () => {
        const env = parse(MULTI_VO);
        expect(env.MULTIVO_ENABLED).toBe(true);
        expect(env.voList).toEqual([
            { shortName: 'def', name: 'Default', logoUrl: 'https://example.com/def.png', oidcEnabled: false, oidcProviders: [] },
            { shortName: 'atl', name: 'ATLAS', logoUrl: 'https://example.com/atl.png', oidcEnabled: false, oidcProviders: [] },
        ]);
    });

    it('accepts the MULTI_VO_ENABLED spelling of the old env generator', () => {
        expect(parse({ ...MULTI_VO, MULTIVO_ENABLED: undefined, MULTI_VO_ENABLED: 'true' }).MULTIVO_ENABLED).toBe(true);
    });

    it('requires a name for every VO', () => {
        expect(() => parse({ ...MULTI_VO, VO_ATL_NAME: undefined })).toThrow('VO_ATL_NAME: is required');
    });

    it('links VO OIDC providers to the configured providers', () => {
        createOIDCProviders();
        try {
            const env = parseServerEnv({ ...process.env, ...MULTI_VO, VO_ATL_OIDC_ENABLED: 'true', VO_ATL_OIDC_PROVIDERS: 'CERN' });
            expect(env.voList[1].oidcProviders.map(provider => provider.name)).toEqual(['cern']);
            expect(() => parseServerEnv({ ...process.env, ...MULTI_VO, VO_ATL_OIDC_ENABLED: 'true', VO_ATL_OIDC_PROVIDERS: 'indigo' })).toThrow(
                'VO_ATL_OIDC_PROVIDERS',
            );
            expect(() => parseServerEnv({ ...process.env, ...MULTI_VO, VO_ATL_OIDC_ENABLED: 'true' })).toThrow(
                'VO_ATL_OIDC_PROVIDERS: is required when OIDC_ENABLED=true',
            );
        } finally {
            deleteOIDCProviders();
        }
    });
});

describe('getServerEnv and getRuntimeConfig', () => {
    afterEach(() => {
        delete process.env.NEXT_PUBLIC_WEBUI_HOST;
    });

    it('reads the process environment', () => {
        expect(getServerEnv().RUCIO_HOST).toBe(process.env.RUCIO_HOST);
    });

    it('only hands the client schema keys to the browser', () => {
        process.env.NEXT_PUBLIC_WEBUI_HOST = 'https://webui.example.com';
        expect(getRuntimeConfig()).toEqual({ NEXT_PUBLIC_WEBUI_HOST: 'https://webui.example.com' });
    });
});
