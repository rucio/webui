import {
    ACCOUNT_NAME_PATTERN_REGEX,
    checkAccountName,
    checkAccountType,
    checkAttribute,
    checkBytes,
    checkEmail,
    checkIdentity,
    checkOptionalEmail,
    checkRseExpression,
    checkUpdateOptions,
    isValidAccountName,
    isValidAccountAttribute,
    isValidEmail,
    toAttributeValueString,
    toValidationError,
    IDENTITY_TYPE_HINTS,
} from './account-validation';
import { AccountUpdateOptions, IDENTITY_TYPES } from '@/lib/core/entity/account';
import { AccountStatus } from '@/lib/core/entity/rucio';

const EM_DASH = String.fromCharCode(0x2014);

describe('account validation', () => {
    it.each(['jdoe', 'j-doe_2', 'a', 'a'.repeat(25)])('accepts account name %s', n => expect(isValidAccountName(n)).toBe(true));
    it.each(['JDoe', 'j.doe', '', 'a'.repeat(26), 'j doe'])('rejects account name "%s"', n => expect(isValidAccountName(n)).toBe(false));
    it.each(['admin', 'country-ch', 'a/b.c', 'True', 'x\\y'])('accepts attribute %s', s => expect(isValidAccountAttribute(s)).toBe(true));
    it.each(['', 'a b', 'a'.repeat(31), 'é'])('rejects attribute "%s"', s => expect(isValidAccountAttribute(s)).toBe(false));
    it('checks email loosely', () => {
        expect(isValidEmail('a@b')).toBe(true);
        expect(isValidEmail('not-an-email')).toBe(false);
    });
    it('stringifies boolean attribute values', () => {
        expect(toAttributeValueString(true)).toBe('True');
        expect(toAttributeValueString('user')).toBe('user');
    });
    it('accepts wildcards only in the list filter pattern', () => {
        expect(isValidAccountName('j*')).toBe(false);
        expect(ACCOUNT_NAME_PATTERN_REGEX.test('j*')).toBe(true);
        expect(ACCOUNT_NAME_PATTERN_REGEX.test('*')).toBe(true);
        expect(ACCOUNT_NAME_PATTERN_REGEX.test('J*')).toBe(false);
    });
    it('has a hint for every real identity type, without em dashes', () => {
        IDENTITY_TYPES.forEach(t => {
            expect(IDENTITY_TYPE_HINTS[t]).toBeDefined();
            expect(JSON.stringify(IDENTITY_TYPE_HINTS[t])).not.toContain(EM_DASH);
        });
    });
});

// The use cases call these checks with untrusted input, so non-string values must fail instead of being coerced.
const notAString = (value: unknown) => value as string;

describe('account checks', () => {
    it('checks the account name', () => {
        expect(checkAccountName('jdoe')).toBeUndefined();
        expect(checkAccountName('Bad Name')).toBe('Invalid account name');
        expect(checkAccountName(notAString(undefined))).toBe('Invalid account name');
    });

    it('checks the account type', () => {
        expect(checkAccountType('SERVICE')).toBeUndefined();
        expect(checkAccountType('UNKNOWN')).toBe('Account type must be USER, GROUP or SERVICE');
    });

    it('checks the email and allows a missing optional email', () => {
        expect(checkEmail('a@b')).toBeUndefined();
        expect(checkEmail('nope')).toBe('Invalid email');
        expect(checkEmail(notAString(undefined))).toBe('Invalid email');
        expect(checkOptionalEmail(null)).toBeUndefined();
        expect(checkOptionalEmail(undefined)).toBeUndefined();
        expect(checkOptionalEmail('nope')).toBe('Invalid email');
    });

    it('names the invalid attribute part', () => {
        expect(checkAttribute('key', 'country')).toBeUndefined();
        expect(checkAttribute('key', 'a b')).toBe('Invalid attribute key');
        expect(checkAttribute('value', notAString(1))).toBe('Invalid attribute value');
    });

    it('checks the identity and its type', () => {
        expect(checkIdentity('CN=jdoe', 'X509')).toBeUndefined();
        expect(checkIdentity('  ', 'X509')).toBe('Identity is required');
        expect(checkIdentity('jdoe', 'UNKNOWN')).toBe('Invalid identity type');
    });

    it('requires an RSE expression', () => {
        expect(checkRseExpression('tier=1')).toBeUndefined();
        expect(checkRseExpression(' ')).toBe('RSE expression is required');
    });

    it.each([0, 1000, -1])('accepts %p bytes', bytes => expect(checkBytes(bytes)).toBeUndefined());
    it.each([-2, 1.5, NaN, Infinity])('rejects %p bytes', bytes => expect(checkBytes(bytes)).toMatch(/Bytes must be/));

    it('checks the update options', () => {
        expect(checkUpdateOptions({ email: null })).toBeUndefined();
        expect(checkUpdateOptions({ status: AccountStatus.SUSPENDED })).toBeUndefined();
        expect(checkUpdateOptions({})).toBe('Provide at least one of email, status or accountType');
        expect(checkUpdateOptions({ foo: 1 } as unknown as AccountUpdateOptions)).toBe('Only email, status and accountType can be updated');
        expect(checkUpdateOptions({ status: 'DELETED' } as unknown as AccountUpdateOptions)).toBe('Status must be ACTIVE or SUSPENDED');
        expect(checkUpdateOptions({ accountType: 'UNKNOWN' } as unknown as AccountUpdateOptions)).toBe('Account type must be USER, GROUP or SERVICE');
        expect(checkUpdateOptions({ email: 'nope' })).toBe('Invalid email');
    });

    it('returns the first failed check as a validation error', () => {
        expect(toValidationError(undefined, undefined)).toBeUndefined();
        expect(toValidationError(undefined, 'first', 'second')).toEqual({ status: 'error', code: 400, name: 'ValidationError', message: 'first' });
    });
});
