import { getPageTitle } from '@/lib/utils/page-title';

describe('getPageTitle', () => {
    it('names account detail pages after the account', () => {
        expect(getPageTitle('/account/jdoe')).toBe('Account: jdoe');
        expect(getPageTitle('/account/root')).toBe('Account: root');
    });

    it('decodes encoded account names', () => {
        expect(getPageTitle('/account/j%2Ddoe')).toBe('Account: j-doe');
    });

    it('keeps the accounts list title', () => {
        expect(getPageTitle('/accounts')).toBe('Accounts');
    });

    it('falls back to the base title for a bare /account path', () => {
        expect(getPageTitle('/account')).toBe('Account');
    });
});
