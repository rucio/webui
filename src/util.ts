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
