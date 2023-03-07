import { OIDCProvider, VO } from "../../entity/auth-models"

export default interface EnvConfigGatewayOutputPort {
    /**
     * Returns the value of the environment variable with the given key if it exists. Returns undefined otherwise.
     * p.s. There is no special Data Transfer Object (DTO) for this use case.
     * @param key The key of the environment variable
     * @param required If true, throws an {@link ConfigNotFound} error if the environment variable does not exist
     * @returns The value of the environment variable with the given key if it exists. Returns undefined if environment variable is not required and does not exist.
     * @throws {@link ConfigNotFound} if the environment variable does not exist and required is true
     */
    get(key: string, required?: boolean): Promise<string | undefined>
    
    /**
     * @returns true if OIDC is enabled, false otherwise.
     */
    oidcEnabled(): Promise<boolean>
    
    /**
     * @returns a list of OIDC providers. It must contain at least one element if OIDC is enabled.
     * @throws {@link InvalidConfig} if OIDC is enabled but the list of OIDC providers is empty
     * @throws {@link ConfigNotFound} if OIDC is required OIDC config is not found for a OIDC provider
     */
    oidcProviders(): Promise<OIDCProvider[]>
    
    /**
     * Returns true if multi-VO is enabled, false otherwise.
     */
    multiVOEnabled(): Promise<boolean>
    
    /**
     * Returns a list of VOs. It must contain at least one element if multi-VO is enabled.
     * @returns A list of a single element containing the default VO if multi-VO is disabled
     * @returns A list of VOs if multi-VO is enabled
     * @throws {@link ConfigNotFound} if VO specific config is not found for a VO
     * @throws {@link InvalidConfig} if multi-VO is enabled but the list of VOs is not found
     */
    voList(): Promise<VO[]>

    /**
     * @returns true if X509 is enabled, false otherwise.
     */
    x509Enabled(): Promise<boolean>

    /**
     * @returns the URL of the Rucio Auth service
     * @throws {@link ConfigNotFound} if RUCIO_AUTH_HOST is not found
     * @throws {@link InvalidConfig} if RUCIO_AUTH_HOST is empty
     */
    rucioAuthHost(): Promise<string>

    /**
     * @returns the URL of the Rucio service
     * @throws {@link ConfigNotFound} if RUCIO_HOST is not found
     * @throws {@link InvalidConfig} if RUCIO_HOST is empty
     */
    rucioHost(): Promise<string>
}