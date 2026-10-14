import { inferCardType } from '@/lib/utils/hotbar-storage';
import { HotBarCardType } from '@/lib/core/entity/hotbar';

describe('inferCardType for account pages', () => {
    it('maps /accounts to ACCOUNT_LIST', () => {
        expect(inferCardType('/accounts')).toBe(HotBarCardType.ACCOUNT_LIST);
    });

    it('maps /accounts with a query string to ACCOUNT_LIST', () => {
        expect(inferCardType('/accounts?x=1')).toBe(HotBarCardType.ACCOUNT_LIST);
    });

    it('maps /account/<name> to ACCOUNT', () => {
        expect(inferCardType('/account/jdoe')).toBe(HotBarCardType.ACCOUNT);
    });

    it('maps /accounts/ sub-paths to ACCOUNT_LIST', () => {
        expect(inferCardType('/accounts/')).toBe(HotBarCardType.ACCOUNT_LIST);
    });

    it('does not treat a DID name containing accounts or account/ as an account page', () => {
        expect(inferCardType('/did/page/scope/accounts.log')).toBe(HotBarCardType.DID);
        expect(inferCardType('/did/page/scope/account/file')).toBe(HotBarCardType.DID);
    });

    it('does not treat another page whose path contains accounts as the accounts list', () => {
        const type = inferCardType('/subscription/accounts-bot/x');
        expect(type).not.toBe(HotBarCardType.ACCOUNT_LIST);
        expect(type).not.toBe(HotBarCardType.ACCOUNT);
    });
});
