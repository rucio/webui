import { BaseDTO } from "@/lib/sdk/dto"

export interface UserPassLoginAuthServerDTO extends BaseDTO {
    statusCode: number
    message: string
    authToken: string
    authTokenExpires: string
    account: string
}