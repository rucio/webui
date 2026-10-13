import { getNavigationCommands, getActionCommands } from '@/lib/infrastructure/command-palette/command-registry';

const ids = (items: { id: string }[]) => items.map(i => i.id);

describe('command registry account entries', () => {
    describe('getNavigationCommands', () => {
        it('adds nav-accounts only for admin with the flag on', () => {
            expect(ids(getNavigationCommands('jdoe', false, true, true))).toContain('nav-accounts');
            expect(ids(getNavigationCommands('jdoe', false, false, true))).not.toContain('nav-accounts');
            expect(ids(getNavigationCommands('jdoe', false, true, false))).not.toContain('nav-accounts');
        });

        it('adds nav-my-account for everyone with the flag on', () => {
            expect(ids(getNavigationCommands('jdoe', false, false, true))).toContain('nav-my-account');
            expect(ids(getNavigationCommands('jdoe', false, true, true))).toContain('nav-my-account');
            expect(ids(getNavigationCommands('jdoe', false, false, false))).not.toContain('nav-my-account');
        });

        it('points nav-my-account at the session account and omits it without one', () => {
            const mine = getNavigationCommands('jdoe', false, false, true).find(c => c.id === 'nav-my-account');
            expect(mine?.url).toBe('/account/jdoe');
            expect(ids(getNavigationCommands(undefined, false, false, true))).not.toContain('nav-my-account');
        });

        it('points nav-accounts at /accounts', () => {
            expect(getNavigationCommands('jdoe', false, true, true).find(c => c.id === 'nav-accounts')?.url).toBe('/accounts');
        });
    });

    describe('getActionCommands', () => {
        it('offers Open account for admins when the query is a valid account name', () => {
            const actions = getActionCommands('jdoe', { isAdmin: true, accountsEnabled: true });
            const last = actions[actions.length - 1];
            expect(last.title).toBe("Open account 'jdoe'");
            expect(last.url).toBe('/account/jdoe');
        });

        it('does not offer it to non-admins, with the flag off, or for invalid names', () => {
            const open = (q: string, o: { isAdmin: boolean; accountsEnabled: boolean }) =>
                getActionCommands(q, o).some(a => a.title.startsWith('Open account'));
            expect(open('jdoe', { isAdmin: false, accountsEnabled: true })).toBe(false);
            expect(open('jdoe', { isAdmin: true, accountsEnabled: false })).toBe(false);
            expect(open('Not An Account', { isAdmin: true, accountsEnabled: true })).toBe(false);
            expect(getActionCommands('jdoe').some(a => a.title.startsWith('Open account'))).toBe(false);
        });
    });
});
