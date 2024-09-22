import { BaseViewModel } from '@/lib/sdk/view-models';
import { RSE, RSEAttribute, RSEAccountUsage, RSEProtocol, RSEType } from '@/lib/core/entity/rucio';

export interface RSEViewModel extends RSE, BaseViewModel {}

export interface RSEProtocolViewModel extends BaseViewModel {
    protocols: RSEProtocol[];
}

export interface RSEAttributeViewModel extends BaseViewModel {
    attributes: RSEAttribute[];
}

export interface RSEAccountUsageLimitViewModel extends RSEAccountUsage, BaseViewModel {
    bytes_remaining: number;
    has_quota: boolean;
    total_expected_usage: number;
}

export function getEmptyRSEAccountUsageLimitViewModel(): RSEAccountUsageLimitViewModel {
    return {
        status: 'error',
        rse_id: '',
        rse: '',
        account: '',
        used_bytes: 0,
        bytes_limit: 0,
    } as RSEAccountUsageLimitViewModel;
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
    } as RSEViewModel;
}

export function generateEmptyRSEProtocolViewModel(): RSEProtocolViewModel {
    return {
        status: 'error',
        protocols: [],
    };
}
