export default interface EnvConfigGatewayOutputPort {
    /**
     * Returns the value of the environment variable with the given key if it exists. Returns undefined otherwise.
     * @param key The key of the environment variable
     */
    get(key: string): Promise<string | undefined>
}