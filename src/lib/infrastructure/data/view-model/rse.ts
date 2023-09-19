import { BaseViewModel } from "@/lib/sdk/view-models"
import { RSE, RSEAttribute, RSEAccountUsageLimit, RSEProtocol, RSEType } from "@/lib/core/entity/rucio"


export interface RSEViewModel extends RSE, BaseViewModel {}

export interface RSEProtocolViewModel extends RSEProtocol, BaseViewModel {}

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
        rseid: '',
        scheme: '',
        hostname: '',
        port: 0,
        prefix: '',
        impl: '',
        priorities_lan: {
            read: 0,
            write: 0,
            delete: 0
        },
        priorities_wan: {
            read: 0,
            write: 0,
            delete: 0,
            tpcwrite: 0,
            tpcread: 0,
        },
    }
}