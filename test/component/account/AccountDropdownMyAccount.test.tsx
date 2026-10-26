import { render, screen } from '@testing-library/react';
import { AccountDropdown } from '@/component-library/features/layout/AccountDropdown';
import { FeatureProvider } from '@/component-library/features/feature-flags/FeatureProvider';
import { FeatureFlagMap } from '@/lib/core/entity/feature-config';

jest.mock('next-auth/react', () => ({ signOut: jest.fn(), useSession: () => ({ data: null, update: jest.fn() }) }));
jest.mock('@/component-library/features/auth/ReauthModal', () => ({ ReauthModal: () => null }));
jest.mock('@/lib/infrastructure/auth/x509-switch', () => ({ switchX509Account: jest.fn() }));

const flags = (accounts: boolean): FeatureFlagMap =>
    ({
        rules: true,
        'rules.create': true,
        'rules.approve': true,
        subscriptions: true,
        rses: true,
        accounts,
        'accounts.manage': true,
        'accounts.manage.core': true,
        'accounts.manage.identities': true,
        'accounts.manage.attributes': true,
        'accounts.manage.quotas': true,
        'dids.metadata': true,
        'dids.mutate': true,
        'dids.ami_tags': false,
        'dids.panda_task': false,
    } as FeatureFlagMap);

const renderDropdown = (accounts: boolean, account = 'jdoe') =>
    render(
        <FeatureProvider features={flags(accounts)}>
            <AccountDropdown menuRef={{ current: null }} accountActive={account} switchEntries={[]} liveAccountCount={1} />
        </FeatureProvider>,
    );

describe('AccountDropdown My account entry', () => {
    it('links to the session account page when accounts is enabled', () => {
        renderDropdown(true);
        expect(screen.getByRole('link', { name: /my account/i })).toHaveAttribute('href', '/account/jdoe');
    });

    it('encodes the account name in the link', () => {
        renderDropdown(true, 'a b');
        expect(screen.getByRole('link', { name: /my account/i })).toHaveAttribute('href', '/account/a%20b');
    });

    it('is hidden when accounts is disabled', () => {
        renderDropdown(false);
        expect(screen.queryByText(/my account/i)).not.toBeInTheDocument();
    });
});
