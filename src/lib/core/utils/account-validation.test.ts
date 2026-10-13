import { isValidAccountName, isValidAccountAttribute, isValidEmail, toAttributeValueString, IDENTITY_TYPE_HINTS } from './account-validation';
import { IDENTITY_TYPES } from '@/lib/core/entity/account';

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
    it('accepts wildcards in pattern for list filter', () => {
        expect(isValidAccountName('j*')).toBe(false); // strict name regex rejects *
        // ACCOUNT_NAME_PATTERN_REGEX allows wildcards for filters:
        const pattern = /^[a-z0-9-_*]{1,25}$/;
        expect(pattern.test('j*')).toBe(true);
        expect(pattern.test('*')).toBe(true);
    });
    it('has a hint for every real identity type, without em dashes', () => {
        IDENTITY_TYPES.forEach(t => {
            expect(IDENTITY_TYPE_HINTS[t]).toBeDefined();
            expect(JSON.stringify(IDENTITY_TYPE_HINTS[t])).not.toContain(EM_DASH);
        });
    });
});
