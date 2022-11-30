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
    Object.entries(replacePayload)?.forEach(([key, value]) => {
        endpoint = endpoint?.replaceAll(`{${key}}`, value)
    })
    return endpoint
}

// extracts scope from a pattern
export const extract_scope = (name: any): string[] => {
    if (name.indexOf(':') > -1) {
        return name.split(':')
    }
    const items = name.split('.')
    if (items.length <= 1) {
        throw Error('')
    }
    let scope = items[0]
    if (name.indexOf('user') === 0 || name.indexOf('group') === 0) {
        scope = items[0] + '.' + items[1]
    }
    return [scope, name]
}

export const vo_names = (vos: string): string[] => {
    const possibleVos: string[] = vos.replace(/\s+/g, '').split(',')
    const vo_names: string[] = []
    for (const vo in possibleVos) {
        const vo_name = env('vo_' + possibleVos[vo]) as string
        vo_names.push(vo_name)
    }
    return vo_names
}
