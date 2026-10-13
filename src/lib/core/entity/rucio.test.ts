import { ACCOUNT_TYPES, AccountType, isKnownAccountType } from './rucio';

describe('account types', () => {
    // Mirrors Rucio's AccountType in lib/rucio/db/sqla/constants.py (USER, GROUP, SERVICE).
    // Rucio exposes no endpoint for the account types, so this list is maintained by hand.
    it('lists exactly the types Rucio defines, without UNKNOWN', () => {
        expect([...ACCOUNT_TYPES]).toEqual(['USER', 'GROUP', 'SERVICE']);
    });

    it.each(['USER', 'GROUP', 'SERVICE'])('accepts %s', value => {
        expect(isKnownAccountType(value)).toBe(true);
    });

    it.each(['user', 'UNKNOWN', '', 'ADMIN', AccountType.UNKNOWN])('rejects %s', value => {
        expect(isKnownAccountType(value)).toBe(false);
    });

    it('rejects non-strings', () => {
        expect(isKnownAccountType(undefined)).toBe(false);
        expect(isKnownAccountType(1)).toBe(false);
    });
});
