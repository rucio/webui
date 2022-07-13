// access any environment variable with env('KEY')
export const env = (value: string): string | undefined => {
    return process.env['REACT_APP_' + value]
}
