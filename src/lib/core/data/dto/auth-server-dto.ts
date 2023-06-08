export type UserPassLoginAuthServerDTO = {
    statusCode: number
    message: string
    authToken: string
    authTokenExpires: string
    account: string
}