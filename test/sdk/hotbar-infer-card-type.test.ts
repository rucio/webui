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
});
