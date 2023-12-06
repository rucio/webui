import { BaseErrorResponseModel } from "@/lib/sdk/usecase-models";
import { AccountRSELimitDTO, AccountRSEUsageDTO } from "../dto/account-dto";
import { RSEDTO } from "../dto/rse-dto";
import { DIDLong, DIDType, RSEAccountUsage } from "../entity/rucio";
import { TAccountRSEUsageAndLimits, TDIDSummaryRow, TRSESummaryRow } from "../entity/rule-summary";


/**
 * Creates a DID Summary Row for the DID Summary Table used to Create New Rules. bytes and requested_bytes are set to -1 if the DID is a derived DID.
 * @param did The DID on which the rule is to be created
 * @param copies The number of replicas of the DID to be created
 * @param files The length of the DID
 * @param size The size of the DID
 * @param requested_size The requested size on any RSE where the rule is to be created
 * @returns A DID Summary Row for the DID Summary Table used to Create New Rules.
 */
export const createDIDSummaryRow = (did: DIDLong, copies: number): TDIDSummaryRow => {
    let bytes = -1;
    let requested_bytes = -1;
    
    if(did.did_type !== DIDType.DERIVED) {
        bytes = did.bytes;
        requested_bytes = did.bytes * copies;
    }

    return {
        ...did,
        length: length,
        copies: copies,
        bytes: bytes,
        requested_bytes: requested_bytes,
    }
}

/**
 * Creates a Map of RSE Name to Account RSE Usage and Limits. The Account RSE Usage and Limits are obtained from the Account Gateway.
 * @param accountLimitsDTO The Account RSE Limits DTO obtained from the Account Gateway
 * @param accountUsageDTOs The Account RSE Usage DTOs obtained from the Account Gateway. This is a streamed endpoint, so the outputs must be collected in a list!
 * @returns A Record<rse_name, {limit: number, bytesRemaining: number}> where limit is the limit of the account on the RSE and bytesRemaining is the number of bytes remaining on the RSE for the account.
 */
export const createAccountRSEUsageAndLimitMap = (accountLimitsDTO: AccountRSELimitDTO, accountUsageDTOs: AccountRSEUsageDTO[]): TAccountRSEUsageAndLimits => {
    const accountRSEUsageAndLimits: TAccountRSEUsageAndLimits = {}
    for(let rseName in accountLimitsDTO.limits) {
        const limit = accountLimitsDTO.limits[rseName];
        accountRSEUsageAndLimits[rseName] = {
            limit: limit,
            bytesRemaining: undefined,
        }
    }

    accountUsageDTOs.forEach((accountUsageDTO: AccountRSEUsageDTO) => {
        const rseName: string = accountUsageDTO.rse;
        if(!accountRSEUsageAndLimits[rseName]) {
            accountRSEUsageAndLimits[rseName] = {
                limit: undefined,
                bytesRemaining: accountUsageDTO.bytes_limit - accountUsageDTO.used_bytes,
            }
        }
        const bytesLimit = accountRSEUsageAndLimits[rseName].limit;
        if(bytesLimit !== undefined && bytesLimit !== -1) {
            accountRSEUsageAndLimits[rseName].bytesRemaining = bytesLimit - accountUsageDTO.used_bytes;
        }
    })

    return accountRSEUsageAndLimits;
}


/**
 * A utility function for usecases that need to get quota information for an RSE, for a given account, and a given number of bytes requested.
 * @param accountRSEUsageAndLimits 
 * @param rseName 
 * @param totalDIDBytesRequested 
 * @returns An augmented RSEDTO object with the following properties:
 * bytes_remaining: The bytes remaining in the RSE for the account
 * has_quota: Whether the account has a quota on the RSE
 * total_expected_usage: The total expected usage of the account on the RSE after the rule is created
 * If an error occurs, a BaseErrorResponseModel is returned.
 * If the account has no limits specified, a BaseErrorResponseModel is returned.
 */
export const getQuotaInfo = ( rse: RSEDTO, account: string, accountRSEUsageAndLimits: TAccountRSEUsageAndLimits, totalDIDBytesRequested: number): TRSESummaryRow & {status: 'success'} | BaseErrorResponseModel => {
    const rseName = rse.name;
    if(!accountRSEUsageAndLimits[rseName]) {
        const errorModel: BaseErrorResponseModel = {
            status: 'error',
            code: 500,
            message: `Could not get usage and quota for ${rseName}`,
            name: 'UseCase Stream Error',
        }
        return errorModel;
    }

    const accountRSEUsageAndLimit = accountRSEUsageAndLimits[rseName];
        
    let bytesLimit = accountRSEUsageAndLimit.limit;
    if(bytesLimit === undefined) {
        const errorModel: BaseErrorResponseModel = {
            status: 'error',
            code: 500,
            message: `Could not get usage and quota for ${rseName}. Account has no limits specified!`,
            name: 'UseCase Stream Error',
        }
        return errorModel;
    }

    if(bytesLimit < 0) {
        bytesLimit = 0;
    }

    let bytesRemaining = accountRSEUsageAndLimit.bytesRemaining? accountRSEUsageAndLimit.bytesRemaining : 0;

    let bytesUsed = bytesLimit - bytesRemaining;
    
    const totalExpectedUsage = totalDIDBytesRequested + bytesUsed;

    let hasQuota = bytesLimit > totalExpectedUsage;

    if(bytesRemaining < 0) {
        bytesRemaining = 0;
    }

    if(bytesUsed < 0 || bytesUsed === Infinity  || isNaN(bytesUsed)) {
        bytesUsed = 0;
    }

    if(bytesLimit === -1 || bytesLimit == Infinity) {
        bytesLimit = -1
        bytesRemaining = -1;
        hasQuota = true;
    }

    return {
        status: 'success',
        rse: rse.name,
        rse_id: rse.id,
        account: account,
        files: -1,
        used_bytes: bytesUsed,
        bytes_limit: bytesLimit,
        bytes_remaining: bytesRemaining,
        has_quota: hasQuota,
        total_expected_usage: totalExpectedUsage,
    };
}