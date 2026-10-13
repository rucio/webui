import { toAccountErrorType, toAccountErrorMessage, AccountOperation } from '@/lib/infrastructure/presenter/utils/account-error-type';
import { AccountErrorType } from '@/lib/infrastructure/data/view-model/account';

const EM_DASH = String.fromCharCode(0x2014);

describe('toAccountErrorType', () => {
    it.each([
        [401, 'AccessDenied', 'permission_denied'],
        [401, 'CannotAuthenticate', 'unauthorized'],
        [401, undefined, 'unauthorized'],
        [403, undefined, 'permission_denied'],
        [404, 'AccountNotFound', 'not_found'],
        [409, 'Duplicate', 'conflict'],
        [400, 'KeyError', 'validation_error'],
        [400, 'ValidationError', 'validation_error'],
        [500, 'InvalidObject', 'validation_error'],
        [500, 'InvalidAccountType', 'validation_error'],
        [500, undefined, 'unknown'],
        [502, 'Whatever', 'unknown'],
    ])('%s + %s -> %s', (code, cls, expected) => expect(toAccountErrorType(code as number, cls as string | undefined)).toBe(expected));
});

describe('toAccountErrorMessage', () => {
    it.each([
        ['permission_denied', 'create-account', 'Only the root account can create or delete accounts on this Rucio server.'],
        ['permission_denied', 'delete-account', 'Only the root account can create or delete accounts on this Rucio server.'],
        ['permission_denied', 'update-account', 'You do not have permission to do this. Your admin role may have changed; try signing in again.'],
        ['unauthorized', 'read', 'Your session has expired. Please sign in again.'],
        ['conflict', 'create-account', 'An account with this name exists or existed before. Deleted account names cannot be reused.'],
        ['conflict', 'add-account-attribute', 'This attribute already exists. Delete it first to change its value.'],
        ['conflict', 'add-account-identity', 'This identity is already mapped to the account.'],
        ['not_found', 'delete-account-attribute', 'The account was not found or is not active.'],
        ['not_found', 'update-account-attribute', 'raw message'],
        ['conflict', 'update-account-attribute', 'raw message'],
        [
            'permission_denied',
            'update-account-attribute',
            'You do not have permission to do this. Your admin role may have changed; try signing in again.',
        ],
        ['not_found', 'read', 'raw message'],
        ['validation_error', 'create-account', 'raw message'],
        ['unknown', 'read', 'raw message'],
    ])('%s + %s -> %s', (type, op, expected) => {
        const message = toAccountErrorMessage(type as AccountErrorType, op as AccountOperation, 'raw message');
        expect(message).toBe(expected);
        expect(message).not.toContain(EM_DASH);
    });

    it('uses a generic message when the fallback is empty', () => {
        expect(toAccountErrorMessage('unknown', 'read', '')).toBe('Something went wrong. Please try again.');
    });
});
