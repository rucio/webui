import EnvConfigGatewayOutputPort from "@/lib/core/port/secondary/env-config-gateway-output-port"
import appContainer from "@/lib/infrastructure/config/ioc/container-config"
import GATEWAYS from "@/lib/infrastructure/config/ioc/ioc-symbols-gateway"

describe('env-config-gateway', () => {
    it('should return the value of the environment variable', async () => {
        const key = 'TEST_ENV_VAR'
        const value = 'test-value'
        process.env[key] = value
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG)
        const result = await gateway.get(key)
        expect(result).toEqual(value)
    })

    it('should return undefined if the environment variable does not exist', async () => {
        const key = 'TEST_ENV_VAR'
        delete process.env[key]
        const gateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG)
        const result = await gateway.get(key)
        expect(result).toBeUndefined()
    })
})