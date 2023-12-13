import { DIDLong, DIDType, RSEAccountUsage } from "@/lib/core/entity/rucio";
import { BaseViewModel } from "@/lib/sdk/view-models";
import { FetchStatus } from "@tanstack/react-query";
import { RSEAccountUsageLimitViewModel } from "./rse";


/**
 * View model for the Create Rule Request.
 * @property rules - The list of pairs of Rule ID and corresponding DID.
 */
export interface CreateRulesViewModel extends BaseViewModel {
    rules: Record<string, string>
}

export const generateEmptyCreateRulesViewModel = (): CreateRulesViewModel => ({
    status: 'error',
    rules: {},
})

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
export interface TFetchCreateRuleSummaryRequest {
    RSEViewModels: Array<RSEAccountUsageLimitViewModel>
    DIDViewModels: Array<DIDLong>
    expirydate: Date
    lifetime: number
    notifications: boolean
    asynchronousMode: boolean
    numcopies: number
    numsamples: number
    groupby: DIDType
    comment: string
    approval: boolean
}

export interface TypedDIDValidationQuery {
    DIDList: Array<DIDName>
}

// TODO move to a separate file
export interface DIDSearchQuery {
    DIDSearchString: string
}

// TODO move to a separate file
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
    data: any, // TODO type this properly
    fetchStatus: FetchStatus
}

export interface RSESearchResponse {
    data: RSEAccountUsage[],
    fetchStatus: FetchStatus
}
