import { ConfigNotFound, InvalidConfig } from '@/lib/core/exceptions/env-config-exceptions';
import { OIDCProvider, VO } from '@/lib/core/entity/auth-models';
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';
import { injectable } from 'inversify';

@injectable()
class EnvConfigGateway implements EnvConfigGatewayOutputPort {
    async listDIDsInitialPattern(): Promise<string | undefined> {
        // Get the initial pattern for listing DIDs (e.g. "scope:name", "scope:*", etc.)
        const value = await this.get('LIST_DIDS_INITIAL_PATTERN');
        if (!value || value.trim() === '') {
            return Promise.resolve(undefined);
        }
        return Promise.resolve(value);
    }

    async projectURL(): Promise<string> {
        const value = await this.get('PROJECT_URL', false);
        if (value === '' || value === undefined) {
            throw new InvalidConfig(`PROJECT_URL:${value} is not defined`);
        }
        return Promise.resolve(value);
    }

    async rucioHost(): Promise<string> {
        const value = await this.get('RUCIO_HOST', true);
        if (value === '' || value === undefined) {
            throw new InvalidConfig(`RUCIO_HOST:${value} is not properly defined`);
        }
        return Promise.resolve(value);
    }

    async rucioAuthHost(): Promise<string> {
        const value = await this.get('RUCIO_AUTH_HOST', true);
        if (value === '' || value === undefined) {
            throw new InvalidConfig(`RUCIO_AUTH_HOST:${value} is not properly defined`);
        }
        return Promise.resolve(value);
    }

    async oidcEnabled(): Promise<boolean> {
        const value = await this.get('OIDC_ENABLED');
        if (value === 'true' || value === 'True' || value === 'TRUE') {
            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    }

    async oidcProviders(): Promise<OIDCProvider[]> {
        const oidcEnabled = await this.oidcEnabled();
        if (!oidcEnabled) {
            return Promise.resolve([]);
        }
        const providers: OIDCProvider[] = [];
        const providerList = await this.get('OIDC_PROVIDERS');
        if (providerList === undefined) {
            throw new InvalidConfig('OIDC_PROVIDERS is not defined, but OIDC_ENABLED is true');
        }
        const providerNames = providerList.split(',').map(provider => provider.trim());
        for (const providerName of providerNames) {
            const requiredProviderConfig = ['AUTHORIZATION_URL', 'TOKEN_URL', 'CLIENT_ID', 'CLIENT_SECRET', 'REDIRECT_URL'];
            const optionalProviderConfig = ['ICON_URL', 'REFRESH_TOKEN_URL', 'USERINFO_URL', 'SCOPES', 'LOGOUT_URL'];
            for (const config of optionalProviderConfig) {
                const key = `OIDC_PROVIDER_${providerName}_${config}`;
                const value = await this.get(key);
            }
            for (const config of requiredProviderConfig) {
                const key = `OIDC_PROVIDER_${providerName}_${config}`;
                const value = await this.get(key);
                if (value === undefined) {
                    throw new ConfigNotFound(key);
                }
            }
            const scopesConfig = await this.get(`OIDC_PROVIDER_${providerName}_SCOPES`);
            const scopes = scopesConfig?.split(',').map(scope => scope.trim());
            const provider: OIDCProvider = {
                name: providerName,
                url: (await this.get(`OIDC_PROVIDER_${providerName}_URL`)) as string,
                iconUrl: (await this.get(`OIDC_PROVIDER_${providerName}_ICON_URL`)) as string,
                clientId: (await this.get(`OIDC_PROVIDER_${providerName}_CLIENT_ID`)) as string,
                clientSecret: (await this.get(`OIDC_PROVIDER_${providerName}_CLIENT_SECRET`)) as string,
                authorizationUrl: (await this.get(`OIDC_PROVIDER_${providerName}_AUTHORIZATION_URL`)) as string,
                tokenUrl: (await this.get(`OIDC_PROVIDER_${providerName}_TOKEN_URL`)) as string,
                refreshTokenUrl: (await this.get(`OIDC_PROVIDER_${providerName}_REFRESH_TOKEN_URL`)) as string,
                userInfoUrl: (await this.get(`OIDC_PROVIDER_${providerName}_USERINFO_URL`)) as string,
                redirectUrl: (await this.get(`OIDC_PROVIDER_${providerName}_REDIRECT_URL`)) as string,
                scopes: scopes as [string],
            };
            providers.push(provider);
        }
        return Promise.resolve(providers);
    }

    async multiVOEnabled(): Promise<boolean> {
        const value = process.env['MULTIVO_ENABLED'];
        if (value === 'true' || value === 'True' || value === 'TRUE') {
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }

    async voList(): Promise<VO[]> {
        const multiVOEnabled = await this.multiVOEnabled();
        const vos: VO[] = [];

        if (!multiVOEnabled) {
            // When Multi-VO is disabled, create a default VO that respects global OIDC settings
            const globalOIDCEnabled = await this.oidcEnabled();
            const allOIDCProviders = globalOIDCEnabled ? await this.oidcProviders() : [];

            vos.push({
                name: 'default',
                shortName: 'def',
                logoUrl: '',
                oidcEnabled: globalOIDCEnabled,
                oidcProviders: allOIDCProviders,
            });
            return Promise.resolve(vos);
        }

        const voList = await this.get('VO_LIST');
        if (voList === undefined) {
            throw new InvalidConfig('VO_LIST is not defined, but MULTIVO_ENABLED is true');
        }
        const allOIDCProviders = await this.oidcProviders();
        const voNames = voList.split(',').map(vo => vo.trim());
        for (const voName of voNames) {
            const name = await this.get(`VO_${voName}_NAME`, true);
            const logoUrl = await this.get(`VO_${voName}_LOGO_URL`);
            const voOIDCEnabledStr = await this.get(`VO_${voName}_OIDC_ENABLED`);
            let voOIDCEnabled = false;
            const voOIDCProviders: OIDCProvider[] = [];
            // if oidc_enabled is true, oidc_providers must be defined
            if (voOIDCEnabledStr === 'true' || voOIDCEnabledStr === 'True' || voOIDCEnabledStr === 'TRUE') {
                voOIDCEnabled = true;
                const voOIDCProviderNames = await this.get(`VO_${voName}_OIDC_PROVIDERS`);
                if (voOIDCProviderNames === undefined) {
                    throw new InvalidConfig(`VO_${voName}_OIDC_PROVIDERS is not defined, but VO_${voName}_OIDC_ENABLED is true`);
                }
                const providerNames = voOIDCProviderNames.split(',').map(provider => provider.trim());
                for (const providerName of providerNames) {
                    const provider = allOIDCProviders.find(provider => provider.name === providerName);
                    if (provider === undefined) {
                        throw new InvalidConfig(`OIDC provider ${providerName} is not defined, but VO_${voName}_OIDC_PROVIDERS is defined`);
                    }
                    voOIDCProviders.push(provider);
                }
            }
            const vo: VO = {
                shortName: voName as string,
                name: name as string,
                logoUrl: logoUrl as string,
                oidcEnabled: voOIDCEnabled,
                oidcProviders: voOIDCProviders,
            };
            vos.push(vo);
        }
        return Promise.resolve(vos);
    }

    async x509Enabled(): Promise<boolean> {
        const value = await this.get('X509_ENABLED');
        if (value === 'false' || value === 'False' || value === 'FALSE') {
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
    }

    async userpassEnabled(): Promise<boolean> {
        const value = await this.get('ENABLE_USERPASS_LOGIN');
        if (value === 'false' || value === 'False' || value === 'FALSE') {
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
    }

    async ruleActivity(): Promise<string> {
        const value = await this.get('RULE_ACTIVITY');
        // Return a default value if the environmental variable is not specified
        return value ?? 'User Subscriptions';
    }

    async get(key: string, required: boolean = false): Promise<string | undefined> {
        let value = process.env[key];
        if (value !== undefined) {
            return Promise.resolve(value);
        }
        value = process.env[key.toUpperCase()];
        if (value !== undefined) {
            return Promise.resolve(value);
        }
        value = process.env[key.toLowerCase()];
        if (value !== undefined) {
            return Promise.resolve(value);
        }
        if (required) {
            throw new ConfigNotFound(key);
        }
        return Promise.resolve(undefined);
    }

    async paramsEncodingEnabled(): Promise<boolean> {
        const value = await this.get('PARAMS_ENCODING_ENABLED');
        if (value === 'true' || value === 'True' || value === 'TRUE') {
            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    }
}

export default EnvConfigGateway;
