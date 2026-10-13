import { AccountGlobalQuota, AccountLimitLocality, AccountLocalQuota } from '@/lib/core/entity/account';
import { AccountErrorType } from '@/lib/infrastructure/data/view-model/account';

export const ACCOUNT_TABS = ['overview', 'identities', 'attributes', 'quotas'] as const;
export type AccountTab = (typeof ACCOUNT_TABS)[number];

export const isAccountTab = (value: string | null | undefined): value is AccountTab => ACCOUNT_TABS.includes(value as AccountTab);

/** What an account query throws: the failed view model, so the error type is known. */
export interface AccountLoadError {
    errorType?: AccountErrorType;
    message?: string;
}

/** The state of one account sub-resource (identities, attributes, quotas), as the page component sees it. */
export interface AccountResource<T> {
    data?: T;
    isLoading: boolean;
    error?: AccountLoadError | null;
    onRetry?: () => void;
}

export interface AccountQuotas {
    local: AccountLocalQuota[];
    global: AccountGlobalQuota[];
}

export interface AccountLimitTarget {
    locality: AccountLimitLocality;
    rseExpression: string;
}

/** The WebUI treats an account as admin when its `admin` attribute is True (stored as a boolean) or "true". */
export const isTruthyAttributeValue = (value: string | boolean): boolean =>
    value === true || (typeof value === 'string' && value.toLowerCase() === 'true');
