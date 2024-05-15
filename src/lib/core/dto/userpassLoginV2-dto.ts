export type UserPassLoginV2AuthServerDTO = {
    status: 'success' | 'error'
    statusCode: number
    message: string
    authToken: string
    authTokenExpires: string
    account: string
}