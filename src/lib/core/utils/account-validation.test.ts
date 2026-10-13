import { isValidAccountName, isValidAccountAttribute, isValidEmail, toAttributeValueString, IDENTITY_TYPE_HINTS } from './account-validation';
import { IdentityType } from '@/lib/core/entity/account';

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
    it('has a hint for every real identity type, without em dashes', () => {
        Object.values(IdentityType).filter(t => t !== IdentityType.UNKNOWN).forEach(t => {
            expect(IDENTITY_TYPE_HINTS[t]).toBeDefined();
            expect(JSON.stringify(IDENTITY_TYPE_HINTS[t])).not.toContain('—');
        });
    });
});
