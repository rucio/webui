import { TIPS } from '@/lib/infrastructure/tips/tips-data';
import { getTipsForPage, TipCategory, TipCategoryLabels } from '@/lib/infrastructure/tips/tip-registry';

const EM_DASH = String.fromCharCode(0x2014);
const ids = (route: string) => getTipsForPage(TIPS, route).map(t => t.id);

describe('account tips', () => {
    it('shows list tips on /accounts and not detail tips', () => {
        const found = ids('/accounts');
        expect(found).toContain('accounts-only-active');
        expect(found).toContain('accounts-wildcard');
        expect(found).not.toContain('account-identity-formats');
    });

    it('shows detail tips on /account/<name> and not list tips', () => {
        const found = ids('/account/jdoe');
        ['account-identity-formats', 'account-userpass-password', 'account-admin-relogin', 'account-quota-precedence'].forEach(id =>
            expect(found).toContain(id),
        );
        expect(found).not.toContain('accounts-only-active');
        expect(found).not.toContain('accounts-wildcard');
    });

    it('files all six under the Accounts category', () => {
        const accountTips = TIPS.filter(t => t.category === TipCategory.ACCOUNTS);
        expect(accountTips).toHaveLength(6);
        expect(TipCategoryLabels[TipCategory.ACCOUNTS]).toBe('Accounts');
    });

    it('uses no em dashes in any account tip', () => {
        TIPS.filter(t => t.category === TipCategory.ACCOUNTS).forEach(t => {
            expect(t.title).not.toContain(EM_DASH);
            expect(t.content).not.toContain(EM_DASH);
        });
    });
});
