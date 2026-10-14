import { AccountErrorType } from '@/lib/infrastructure/data/view-model/account';

const VALIDATION_CLASSES = new Set(['InvalidObject', 'InvalidAccountType', 'ValidationError', 'IdentityError']);

export function toAccountErrorType(code: number, errorClass?: string): AccountErrorType {
    if (code === 401) return errorClass === 'AccessDenied' ? 'permission_denied' : 'unauthorized';
    if (code === 403) return 'permission_denied';
    if (code === 404) return 'not_found';
    if (code === 409) return 'conflict';
    if (code === 400) return 'validation_error';
    if (code === 500 && errorClass && VALIDATION_CLASSES.has(errorClass)) return 'validation_error';
    return 'unknown';
}

export type AccountOperation =
    | 'create-account'
    | 'update-account'
    | 'delete-account'
    | 'add-account-attribute'
    | 'update-account-attribute'
    | 'delete-account-attribute'
    | 'add-account-identity'
    | 'delete-account-identity'
    | 'set-account-limit'
    | 'delete-account-limit'
    | 'read';

/** User-facing message; falls back to the Rucio message. No em dashes. */
export function toAccountErrorMessage(type: AccountErrorType, op: AccountOperation, fallback: string): string {
    // The update use case words the rollback outcome itself; keep it even for a permission error on the add.
    if (op === 'update-account-attribute' && (fallback.includes('previous value was restored') || fallback.includes('is now missing'))) {
        return fallback;
    }
    if (type === 'permission_denied' && (op === 'create-account' || op === 'delete-account')) {
        return 'Only the root account can create or delete accounts on this Rucio server.';
    }
    if (type === 'permission_denied') return 'You do not have permission to do this. Your admin role may have changed; try signing in again.';
    if (type === 'unauthorized') return 'Your session has expired. Please sign in again.';
    // The update use case words its own errors (missing attribute, rollback outcome), so its message is kept.
    if (op === 'update-account-attribute') return fallback || 'Something went wrong. Please try again.';
    if (type === 'conflict' && op === 'create-account')
        return 'An account with this name exists or existed before. Deleted account names cannot be reused.';
    if (type === 'conflict' && op === 'add-account-attribute') return 'This attribute already exists. Delete it first to change its value.';
    if (type === 'conflict' && op === 'add-account-identity') return 'This identity is already mapped to the account.';
    if (type === 'not_found' && op !== 'read') return 'The account was not found or is not active.';
    return fallback || 'Something went wrong. Please try again.';
}
