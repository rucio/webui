import { BaseViewModel } from "@/lib/sdk/view-models"
import { RSE, RSEAttribute, RSEAccountUsageLimit, RSEProtocol, RSEType } from "@/lib/core/entity/rucio"


export interface RSEViewModel extends RSE, BaseViewModel {}

export interface RSEProtocolViewModel extends BaseViewModel {
    protocols: RSEProtocol[]
}

export interface RSEAttributeViewModel extends RSEAttribute, BaseViewModel {}

export interface RSEAccountUsageLimitViewModel extends RSEAccountUsageLimit, BaseViewModel {}

export function getEmptyRSEAccountUsageLimitViewModel(): RSEAccountUsageLimitViewModel {
    return {
        status: 'error',
        rse_id: '',
        rse: '',
        account: '',
        used_files: 0,
        used_bytes: 0,
        quota_bytes: 0,
    } as RSEAccountUsageLimitViewModel
}

export function generateEmptyRSEViewModel(): RSEViewModel {
    return {
        status: 'error',
        id: '',
        name: '',
        rse_type: RSEType.UNKNOWN,
        volatile: false,
        deterministic: false,
        staging_area: false,


    } as RSEViewModel
}

export function generateEmptyRSEProtocolViewModel(): RSEProtocolViewModel {
    return {
        status: 'error',
        protocols: [],
    }
}