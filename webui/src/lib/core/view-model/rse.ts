import { BaseViewModel } from '@/lib/sdk/view-models';
import { RSE, RSEAttribute, RSEAccountUsage, RSEProtocol, RSEType, RSEDetails } from '@/lib/core/entity/rucio';

export interface RSEViewModel extends RSE, BaseViewModel {}

export interface RSEDetailsViewModel extends RSEDetails, BaseViewModel {}

export interface RSEProtocolViewModel extends BaseViewModel {
    protocols: RSEProtocol[];
}

export interface RSEAttributeViewModel extends BaseViewModel {
    attributes: RSEAttribute[];
}

export interface RSEAccountUsageViewModel extends RSEAccountUsage, BaseViewModel {}

export function generateEmptyRSEAccountUsageViewModel(): RSEAccountUsageViewModel {
    return {
        status: 'error',
        rse_id: '',
        rse: '',
        bytes_limit: 0,
        files: 0,
        account: '',
        used_bytes: 0,
    };
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
        bytes_remaining: 0,
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

export function generateEmptyRSEDetailsViewModel(): RSEDetailsViewModel {
    return {
        status: 'error',
        id: '',
        name: '',
        rse_type: RSEType.UNKNOWN,
        volatile: false,
        deterministic: false,
        staging_area: false,
        protocols: [],
        availability_delete: false,
        availability_read: false,
        availability_write: false,
    } as RSEDetailsViewModel;
}

export function generateEmptyRSEProtocolViewModel(): RSEProtocolViewModel {
    return {
        status: 'error',
        protocols: [],
    };
}
