import { DateISO } from "@/lib/core/entity/rucio"
import { BaseViewModel } from "@/lib/sdk/view-models"
import { RSE, RSEAttribute, RSEAccountUsageLimit, RSEProtocol } from "@/lib/core/entity/rucio"


export interface RSEViewModel extends RSE, BaseViewModel {}

export interface RSEProtocolViewModel extends RSEProtocol, BaseViewModel {}

export interface RSEAttributeViewModel extends RSEAttribute, BaseViewModel {}

export interface RSEAccountUsageLimitViewModel extends RSEAccountUsageLimit, BaseViewModel {}

export function getEmptyRSEAccountUsageLimitViewModel(): RSEAccountUsageLimitViewModel {
    return {
        status: 'success',
        rse_id: '',
        rse: '',
        account: '',
        used_files: 0,
        used_bytes: 0,
        quota_bytes: 0,
    } as RSEAccountUsageLimitViewModel
}