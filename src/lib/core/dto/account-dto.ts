import { BaseDTO, BaseStreamableDTO } from "@/lib/sdk/dto"
import { RSEAccountUsageLimit } from "../entity/rucio"

type TAccountAttribute = {
    key: string,
    value: string
}

export type TAccountAttributes = TAccountAttribute[]

/**
 * Account Attributes DTO to store the response from /accounts/<account>/attr/ endpoint
 */
export type AccountAttributesDTO = {
    account: string,
    attributes: TAccountAttributes,
    status: 'OK' | 'ERROR'
    error?: AccountAttributeErrorTypesDTO
    message?: string 
}
export enum AccountAttributeErrorTypesDTO{
    RUCIO_HOST_NOT_CONFIGURED = 'RucioHost Not Configured',
    RUCIO_SERVER_DID_NOT_RETURN_A_RESPONSE = 'Rucio Server did not return a response',
    RUCIO_AUTH_TOKEN_IS_INVALID_OR_EXPIRED = 'Rucio Auth Token is invalid or expired',
    CANNOT_PARSE_RESPONSE_FROM_RUCIO_SERVER = 'Cannot parse response from Rucio Server',
    NO_ATTRIBUTES_FOUND_FOR_ACCOUNT = 'No attributes found for account',
    UNKNOWN_ERROR = 'Unknown Error'
}


/**
 * DTO for storing the response from /accounts/<account>/rse-usage/ endpoint
 */
export interface ListAccountRSEUsageDTO extends BaseStreamableDTO {}

/**
 * DTO for storing individually streamed RSE Usage for an account
 */
export interface AccountRSEUsageDTO extends BaseDTO, RSEAccountUsageLimit {}
