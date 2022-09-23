// access any environment variable with env('KEY')
export const env = (value: string): string | undefined => {
    const envPrefix = 'REACT_APP_'
    const envKeyUpperCase: string = envPrefix + value
    const envKeyLowerCase: string = envPrefix.toLowerCase() + value
    const envValueUpperCase = process.env[envKeyUpperCase]
    const envValueLowerCase = process.env[envKeyLowerCase]
    if (envValueUpperCase) {
        return envValueUpperCase
    } else {
        return envValueLowerCase
    }
}

// does a string replace with the value provided
export const parsedEndpoint = (
    endpoint: string,
    replacePayload: object,
): string => {
    Object.entries(replacePayload).forEach(([key, value]) => {
        endpoint = endpoint.replaceAll(`{${key}}`, value)
    })
    return endpoint
}
