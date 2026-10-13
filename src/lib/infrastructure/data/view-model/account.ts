import { AccountInfo, AccountStatus, AccountType } from '@/lib/core/entity/rucio';
import { AccountAttribute, AccountGlobalQuota, AccountIdentity, AccountListItem, AccountLocalQuota } from '@/lib/core/entity/account';
import { BaseViewModel } from '@/lib/sdk/view-models';

export type AccountErrorType = 'unauthorized' | 'permission_denied' | 'not_found' | 'conflict' | 'validation_error' | 'unknown';

export interface AccountListItemViewModel extends BaseViewModel, AccountListItem {
    errorType?: AccountErrorType;
}

export function generateEmptyAccountListItemViewModel(): AccountListItemViewModel {
    return {
        status: 'error',
        account: '',
        accountType: AccountType.UNKNOWN,
        email: null,
    };
}

export interface AccountInfoViewModel extends BaseViewModel, AccountInfo {
    errorType?: AccountErrorType;
}

export function generateEmptyAccountInfoViewModel(): AccountInfoViewModel {
    return {
        status: 'error',
        account: '',
        accountType: AccountType.UNKNOWN,
        accountStatus: AccountStatus.UNKNOWN,
        email: '',
        createdAt: '',
        updatedAt: '',
    } as AccountInfoViewModel;
}

export interface AccountAttributesViewModel extends BaseViewModel {
    attributes: AccountAttribute[];
    errorType?: AccountErrorType;
}

export function generateEmptyAccountAttributesViewModel(): AccountAttributesViewModel {
    return { status: 'error', attributes: [] };
}

export interface AccountIdentitiesViewModel extends BaseViewModel {
    identities: AccountIdentity[];
    errorType?: AccountErrorType;
}

export function generateEmptyAccountIdentitiesViewModel(): AccountIdentitiesViewModel {
    return { status: 'error', identities: [] };
}

export interface AccountQuotasViewModel extends BaseViewModel {
    local: AccountLocalQuota[];
    global: AccountGlobalQuota[];
    errorType?: AccountErrorType;
}

export function generateEmptyAccountQuotasViewModel(): AccountQuotasViewModel {
    return { status: 'error', local: [], global: [] };
}

export interface AccountMutationViewModel extends BaseViewModel {
    errorType?: AccountErrorType;
}

export function generateEmptyAccountMutationViewModel(): AccountMutationViewModel {
    return { status: 'error' };
}

export interface CreateAccountViewModel extends AccountMutationViewModel {
    account?: string;
}
export type UpdateAccountViewModel = AccountMutationViewModel;
export type DeleteAccountViewModel = AccountMutationViewModel;
export type AddAccountAttributeViewModel = AccountMutationViewModel;
export type DeleteAccountAttributeViewModel = AccountMutationViewModel;
export type AddAccountIdentityViewModel = AccountMutationViewModel;
export type DeleteAccountIdentityViewModel = AccountMutationViewModel;
export type SetAccountLimitViewModel = AccountMutationViewModel;
export type DeleteAccountLimitViewModel = AccountMutationViewModel;

export function generateEmptyCreateAccountViewModel(): CreateAccountViewModel {
    return { status: 'error' };
}
export const generateEmptyUpdateAccountViewModel = generateEmptyAccountMutationViewModel;
export const generateEmptyDeleteAccountViewModel = generateEmptyAccountMutationViewModel;
export const generateEmptyAddAccountAttributeViewModel = generateEmptyAccountMutationViewModel;
export const generateEmptyDeleteAccountAttributeViewModel = generateEmptyAccountMutationViewModel;
export const generateEmptyAddAccountIdentityViewModel = generateEmptyAccountMutationViewModel;
export const generateEmptyDeleteAccountIdentityViewModel = generateEmptyAccountMutationViewModel;
export const generateEmptySetAccountLimitViewModel = generateEmptyAccountMutationViewModel;
export const generateEmptyDeleteAccountLimitViewModel = generateEmptyAccountMutationViewModel;
