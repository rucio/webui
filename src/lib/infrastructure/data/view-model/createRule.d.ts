import { DIDDTO, DIDType } from "@/lib/core/data/rucio-dto";
import { FetchStatus } from "@tanstack/react-query";

export interface CreateRuleViewModel {
    placeholder: string;
}

/*
*  Data structures
*/
export type DIDName = string
export type RSEName = string

export interface DIDElement {
    DID: DIDName
    DIDType: DIDType
}

export interface DIDQueryError {
    DID: DIDName
    ErrorCodes: Array<number>
    Message?: string
}

export interface RSEInformation {
    RSEName: RSEName
    RSEID: string
    RemainingQuota: number
    TotalQuota: number
}

/*
*  Queries
*/
export interface CreateRuleQuery {
    // To be run at the end of the function (`submit` pressed)
    // Contains all the information entered by the user
    DIDList: Array<DIDName>
    RSEList: Array<RSEName>
    expirydate: Date
    notifications: boolean
    asynchronousMode: boolean
    numcopies: number
    numsamples: number
    groupby: DIDType
    comment: string
}

export interface TypedDIDValidationQuery {
    DIDList: Array<DIDName>
}

export interface DIDSearchQuery {
    DIDSearchString: string
}

export interface RSESearchQuery {
    RSEExpression: string
}


/*
*  Responses
*/
export interface CreateRuleResponse {
    // To be run at the end of the function (`submit` pressed)
    success: boolean
    errormessage?: string
}

export interface TypedDIDValidationResponse {
    ErrorList: Array<DIDQueryError>
}

export interface DIDSearchResponse {
    data: Array<DIDDTO>,
    fetchStatus: FetchStatus
}

export interface RSESearchResponse {
    RSEList: Array<RSEInformation>
}