// access any environment variable with env('KEY')
export const env = (value: string): string | undefined => {
    if (process.env['REACT_APP_local'] === 'true') {
        return process.env['REACT_APP_' + value]
    } else {
        return process.env[value]
    }
}
