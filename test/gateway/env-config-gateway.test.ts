import { ConfigNotFound, InvalidConfig } from '@/lib/core/data/env-config-exceptions'
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port'
import appContainer from '@/lib/infrastructure/config/ioc/container-config'
import GATEWAYS from '@/lib/infrastructure/config/ioc/ioc-symbols-gateway'
import { createOIDCProviders, deleteOIDCProviders } from 'test/fixtures/oidc-provider-config'


describe('env-config-gateway', () => {
    it('should return the value of the environment variable', async () => {
        const key = 'TEST_ENV_VAR'
        const value = 'test-value'
        process.env[key] = value
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        const result = await gateway.get(key)
        expect(result).toEqual(value)
    })

    it('should return undefined if the environment variable does not exist', async () => {
        const key = 'TEST_ENV_VAR'
        delete process.env[key]
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        const result = await gateway.get(key)
        expect(result).toBeUndefined()
    })
    it('should return x509 enabled by default', async () => {
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        const result = await gateway.x509Enabled()
        expect(result).toBe(true)
    })
    it('should return x509 enabled if the environment variable is true', async () => {
        const key = 'X509_ENABLED'
        const value = 'true'
        process.env[key] = value
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        const result = await gateway.x509Enabled()
        expect(result).toBe(true)
    })
    it('should return x509 disabled if the environment variable is false', async () => {
        const key = 'X509_ENABLED'
        const value = 'false'
        process.env[key] = value
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        const result = await gateway.x509Enabled()
        expect(result).toBe(false)
    })
})

describe('env-config-gateway oidc config test', () => {
    beforeEach(() => {
        createOIDCProviders()
    })
    afterEach(() => {
        deleteOIDCProviders()
    })
    it('should return oidc enabled if the environment variable is true', async () => {
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        const result = await gateway.oidcEnabled()
        expect(result).toBe(true)
    })
    it('should return oidc disabled if the environment variable is false', async () => {
        process.env['OIDC_ENABLED'] = 'false'
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        const result = await gateway.oidcEnabled()
        expect(result).toBe(false)
    })
    it('should return oidc providers', async () => {
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        const result = await gateway.oidcProviders()
        expect(result.length).toEqual(2)
        const cern = result[0]

        expect(cern.name).toEqual('cern')
        expect(cern.url).toEqual('https://cern.ch')
        expect(cern.iconUrl).toEqual('https://cern.ch/icon.png')
        expect(cern.clientId).toEqual('client-id')
        expect(cern.clientSecret).toEqual('client-secret')
        expect(cern.scopes).toEqual(['scope1', 'scope2'])
        expect(cern.authorizationUrl).toEqual('https://cern.ch/auth')
        expect(cern.tokenUrl).toEqual('https://cern.ch/token')
        expect(cern.userInfoUrl).toEqual('https://cern.ch/userinfo')
        expect(cern.redirectUrl).toEqual('https://cern.ch/redirect')
        expect(cern.refreshTokenUrl).toEqual('https://cern.ch/userinfo')
    })
    it('should throw InvalidConfig if oidc is enabled but no providers are provided', async () => {
        delete process.env['OIDC_PROVIDERS']
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        await expect(gateway.oidcProviders()).rejects.toThrow(InvalidConfig)
    })

    it('should NOT throw InvalidConfig if url for OIDC Provider is not provided', async () => {
        delete process.env['OIDC_PROVIDER_TEST-PROVIDER_URL']
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        const result = await gateway.oidcProviders()
        expect(result.length).toEqual(2)
        const testProvider = result[1]
        expect(testProvider.url).toBeUndefined()
    })

    it('should throw ConfigNotFound if authorization url for OIDC Provider is not provided', async () => {
        delete process.env['OIDC_PROVIDER_TEST-PROVIDER_AUTHORIZATION_URL']
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        await expect(gateway.oidcProviders()).rejects.toThrow(ConfigNotFound)
    })
})

describe('env-config-gateway MultiVo Config', () => {
    beforeEach(() => {
       createOIDCProviders()
       process.env['MULTIVO_ENABLED'] = 'true'
       process.env['VO_LIST'] = 'vo1,vo2'
       
       process.env['VO_VO1_NAME'] = 'virtual organization 1'
       process.env['VO_VO1_LOGO_URL'] = 'https://vo1.ch/logo.png'
       process.env['VO_VO1_OIDC_ENABLED'] = 'true'
       process.env['VO_VO1_OIDC_PROVIDERS'] = 'cern,test-provider'

       process.env['VO_VO2_NAME'] = 'virtual organization 2'

    })
    afterEach(() => {
        deleteOIDCProviders()
        delete process.env['MULTIVO_ENABLED']
        delete process.env['VO_LIST']
        delete process.env['VO_VO1_NAME']
        delete process.env['VO_VO1_LOGO_URL']
        delete process.env['VO_VO1_OIDC_ENABLED']
        delete process.env['VO_VO1_OIDC_PROVIDERS']
        delete process.env['VO_VO2_NAME']
    })
    it('env-config-gateway should return value of MULTIVO_ENABLED', async () => {
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        const result = await gateway.multiVOEnabled()
        expect(result).toEqual(true)
        // test default value of MULTIVO_ENABLED is false
        delete process.env['MULTIVO_ENABLED']
        const result2 = await gateway.multiVOEnabled()
        expect(result2).toEqual(false)
    })

    it('should return default vo list if multi_vo is disabled', async () => {
        process.env['MULTIVO_ENABLED'] = 'false'
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        const result = await gateway.voList()
        expect(result[0].name).toEqual('default')
    })

    it('should not return default vo if multi_vo is enabled', async () => {
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        const result = await gateway.voList()
        for (const vo of result) {
            expect(vo.name).not.toEqual('default')
        }
    })

    it('should return vo list if multi_vo is properly configured', async () => {
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        const result = await gateway.voList()
        expect(result.length).toEqual(2)
        expect(result[0].name).toEqual('virtual organization 1')
        expect(result[0].logoUrl).toEqual('https://vo1.ch/logo.png')
        expect(result[0].oidcEnabled).toEqual(true)
        expect(result[0].oidcProviders).toHaveLength(2)

        expect(result[1].name).toEqual('virtual organization 2')
        expect(result[1].logoUrl).toBeUndefined()
        expect(result[1].oidcEnabled).toEqual(false)
        expect(result[1].oidcProviders).toHaveLength(0)
    })

    it('should throw InvalidConfig if multi_vo is enabled but no vo_list is provided', async () => {
        delete process.env['VO_LIST']
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        await expect(gateway.voList()).rejects.toThrow(InvalidConfig)
    })

    it('should throw ConfigNotFound if multi_vo is enabled but no vo_name is provided for any specified vo', async () => {
        delete process.env['VO_VO1_NAME']
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        await expect(gateway.voList()).rejects.toThrow(ConfigNotFound)
    })
})

describe('env-config-gateway Rucio Host config', () => {
    it('should throw ConfigNotFound if RUCIO_HOST is not provided', async () => {
        delete process.env['RUCIO_HOST']
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        await expect(gateway.rucioHost()).rejects.toThrow(ConfigNotFound)
    })
    it('should return RUCIO_HOST if provided', async () => {
        process.env['RUCIO_HOST'] = 'https://rucio.ch'
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        const result = await gateway.rucioHost()
        expect(result).toEqual('https://rucio.ch')
        delete process.env['RUCIO_HOST']
    })
    it('should throw InvalidConfig if RUCIO_HOST is empty', async () => {
        process.env['RUCIO_HOST'] = ''
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        await expect(gateway.rucioHost()).rejects.toThrow(InvalidConfig)
        delete process.env['RUCIO_HOST']
    })
    it('should throw ConfigNotFound if RUCIO_AUTH_HOST is not provided', async () => {
        delete process.env['RUCIO_AUTH_HOST']
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        await expect(gateway.rucioAuthHost()).rejects.toThrow(ConfigNotFound)
    })
    it('should return RUCIO_AUTH_HOST if provided', async () => {
        process.env['RUCIO_AUTH_HOST'] = 'https://rucio-auth.ch'
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        const result = await gateway.rucioAuthHost()
        expect(result).toEqual('https://rucio-auth.ch')
        delete process.env['RUCIO_AUTH_HOST']
    })
    it('should throw InvalidConfig if RUCIO_AUTH_HOST is empty', async () => {
        process.env['RUCIO_AUTH_HOST'] = ''
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(
            GATEWAYS.ENV_CONFIG,
        )
        await expect(gateway.rucioAuthHost()).rejects.toThrow(InvalidConfig)
        delete process.env['RUCIO_AUTH_HOST']
    })
})