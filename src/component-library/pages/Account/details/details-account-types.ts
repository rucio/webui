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

/**
 * Which account changes the viewer may make. Each area needs the Permix account permission
 * and its accounts.manage.* feature flag, so a deployment can turn areas off one by one.
 */
export interface AccountManageAccess {
    /** Edit email and type, suspend and reactivate (accounts.manage.core). */
    edit: boolean;
    /** Delete the account (accounts.manage.core, account lifecycle permission). */
    delete: boolean;
    /** Add and remove identities (accounts.manage.identities). */
    identities: boolean;
    /** Add, edit and delete attributes (accounts.manage.attributes). */
    attributes: boolean;
    /** Set and remove quotas (accounts.manage.quotas). */
    quotas: boolean;
}

/** Read-only access: no account changes. */
export const NO_MANAGE_ACCESS: AccountManageAccess = { edit: false, delete: false, identities: false, attributes: false, quotas: false };

export interface AccountQuotas {
    local: AccountLocalQuota[];
    global: AccountGlobalQuota[];
    /** Rucio could not list the global quotas; global is then empty. */
    globalError?: string;
}

export interface AccountLimitTarget {
    locality: AccountLimitLocality;
    rseExpression: string;
}

/** The WebUI treats an account as admin when its `admin` attribute is True (stored as a boolean) or "true". */
export const isTruthyAttributeValue = (value: string | boolean): boolean =>
    value === true || (typeof value === 'string' && value.toLowerCase() === 'true');
