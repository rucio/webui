import { OIDCProvider, VO } from "../../entity/auth-models"

export default interface EnvConfigGatewayOutputPort {
    /**
     * Returns the value of the environment variable with the given key if it exists. Returns undefined otherwise.
     * p.s. There is no special Data Transfer Object (DTO) for this use case.
     * @param key The key of the environment variable
     */
    get(key: string): Promise<string | undefined>
    oidcEnabled(): Promise<boolean>
    oidcProviders(): Promise<OIDCProvider[]>
    multiVOEnabled(): Promise<boolean>
    voList(): Promise<VO[]>
    x509Enabled(): Promise<boolean>
}