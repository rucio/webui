import { InvalidConfig } from "@/lib/core/data/env-config-exceptions";
import { OIDCProvider, VO } from "@/lib/core/entity/auth-models";
import EnvConfigGatewayOutputPort from "@/lib/core/port/secondary/env-config-gateway-output-port";
import { injectable } from "inversify";

@injectable()
class EnvConfigGateway implements EnvConfigGatewayOutputPort {
    async oidcEnabled(): Promise<boolean> {
        const value = await this.get('OIDC_ENABLED')
        if (value === 'true' || value === 'True' || value === 'TRUE') {
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    }

    async oidcProviders(): Promise<OIDCProvider[]> {
        const oidcEnabled = await this.oidcEnabled()
        if (!oidcEnabled) {
            return Promise.resolve([])
        }
        const providers: OIDCProvider[] = []
        const providerList = await this.get('OIDC_PROVIDERS')
        if (providerList === undefined) {
            throw new InvalidConfig('OIDC_PROVIDERS is not defined, but OIDC_ENABLED is true')
        }
        const providerNames = providerList.split(',').map((provider) => provider.trim())
        for (const providerName of providerNames) {
            const provider_config = [
                'ICON_URL',
                'CLIENT_ID',
                'CLIENT_SECRET',
                'AUTHORIZATION_URL',
                'TOKEN_URL',
                'REFRESH_TOKEN_URL',
                'USERINFO_URL',
                'REDIRECT_URL',
                'SCOPES',
                'LOGOUT_URL'
            ]
            for (const config of provider_config) {
                const key = `OIDC_PROVIDER_${providerName}_${config}`
                const value = await this.get(key)
                if (value === undefined) {
                    throw new InvalidConfig(`${key} is not defined, but OIDC_ENABLED is true`)
                }
            }
            let scopesConfig = await this.get(`OIDC_PROVIDER_${providerName}_SCOPES`)
            const scopes = scopesConfig?.split(',').map((scope) => scope.trim())
            const provider: OIDCProvider = {
                name: providerName,
                url: await this.get(`OIDC_PROVIDER_${providerName}_URL`) as string,
                iconUrl: await this.get(`OIDC_PROVIDER_${providerName}_ICON_URL`) as string,
                clientId: await this.get(`OIDC_PROVIDER_${providerName}_CLIENT_ID`) as string,
                clientSecret: await this.get(`OIDC_PROVIDER_${providerName}_CLIENT_SECRET`) as string,
                authorizationUrl: await this.get(`OIDC_PROVIDER_${providerName}_AUTHORIZATION_URL`) as string,
                tokenUrl: await this.get(`OIDC_PROVIDER_${providerName}_TOKEN_URL`) as string,
                refreshTokenUrl: await this.get(`OIDC_PROVIDER_${providerName}_REFRESH_TOKEN_URL`) as string,
                userInfoUrl: await this.get(`OIDC_PROVIDER_${providerName}_USERINFO_URL`) as string,
                redirectUrl: await this.get(`OIDC_PROVIDER_${providerName}_REDIRECT_URL`) as string,
                scopes: scopes as [string],
            }
            providers.push(provider)
        }
        return Promise.resolve(providers)
    }

    async multiVOEnabled(): Promise<boolean> {
        const value = process.env['MULTIVO_ENABLED']
        if (value === 'true' || value === 'True' || value === 'TRUE') {
            return Promise.resolve(true)
        }
        return Promise.resolve(false)
    }

    async voList(): Promise<VO[]> {
        const multiVOEnabled = await this.multiVOEnabled()
        const vos: VO[] = []

        if (!multiVOEnabled) {
            vos.push({
                name: 'default',
                shortName: 'def',
                logo_url: '',
                oidc_enabled: false,
                oidc_providers: []
            })
            return Promise.resolve(vos)
        }

        const voList = await this.get('VO_LIST')
        if (voList === undefined) {
            throw new InvalidConfig('VO_LIST is not defined, but MULTIVO_ENABLED is true')
        }
        const oidcProviders = await this.oidcProviders()
        const voNames = voList.split(',').map((vo) => vo.trim())
        for (const voName of voNames) {
            const name = await this.get(`VO_${voName}_NAME`)
            const logoUrl = await this.get(`VO_${voName}_LOGO_URL`)
            const oidcEnabledStr = await this.get(`VO_${voName}_OIDC_ENABLED`)
            let oidcEnabled = false
            // if oidc_enabled is true, oidc_providers must be defined
            if (oidcEnabledStr === 'true' || oidcEnabledStr === 'True' || oidcEnabledStr === 'TRUE') {
                oidcEnabled = true
                const oidc_providers = await this.get(`VO_${voName}_OIDC_PROVIDERS`)
                if (oidc_providers === undefined) {
                    throw new InvalidConfig(`VO_${voName}_OIDC_PROVIDERS is not defined, but VO_${voName}_OIDC_ENABLED is true`)
                }
                const providerNames = oidc_providers.split(',').map((provider) => provider.trim())
                for (const providerName of providerNames) {
                    const provider = oidcProviders.find((provider) => provider.name === providerName)
                    if (provider === undefined) {
                        throw new InvalidConfig(`OIDC provider ${providerName} is not defined, but VO_${voName}_OIDC_PROVIDERS is defined`)
                    }
                }
            }
            const vo: VO = {
                shortName: voName as string,
                name: name as string,
                logo_url: logoUrl as string,
                oidc_enabled: oidcEnabled,
                oidc_providers: oidcProviders
            }
            vos.push(vo)
        }
        return Promise.resolve(vos)
    }

    async x509Enabled(): Promise<boolean> {
        const value = process.env['X509_ENABLED']
        if (value === 'false' || value === 'False' || value === 'FALSE') {
            return Promise.resolve(false)
        }
        return Promise.resolve(true)
    }

    async get(key: string): Promise<string | undefined> {
        let value = process.env[key]
        if (value !== undefined) {
            return Promise.resolve(value)
        }
        value = process.env[key.toUpperCase()]
        if (value !== undefined) {
            return Promise.resolve(value)
        }
        value = process.env[key.toLowerCase()]
        if (value !== undefined) {
            return Promise.resolve(value)
        }
        return Promise.resolve(undefined)
    }
}

export default EnvConfigGateway