import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { DetailsAccount, DetailsAccountProps } from '@/component-library/pages/Account/details/DetailsAccount';
import { AccountManageAccess, AccountResource, NO_MANAGE_ACCESS } from '@/component-library/pages/Account/details/details-account-types';
import { AccountStatus, AccountType } from '@/lib/core/entity/rucio';
import { AccountAttribute, AccountIdentity, IdentityType } from '@/lib/core/entity/account';

const FULL_ACCESS: AccountManageAccess = { edit: true, delete: true, identities: true, attributes: true, quotas: true };

const EM_DASH = String.fromCharCode(0x2014);

const ok = <T,>(data: T): AccountResource<T> => ({ data, isLoading: false });

const identities: AccountIdentity[] = [
    { identity: 'CN=Jane Doe,DC=example,DC=org', type: IdentityType.X509, email: 'jdoe@example.com' },
    { identity: 'jdoe', type: IdentityType.USERPASS, email: 'jdoe@example.com' },
];
const attributes: AccountAttribute[] = [
    { key: 'admin', value: true },
    { key: 'country-ch', value: 'user' },
];

const makeProps = (overrides: Partial<DetailsAccountProps> = {}): DetailsAccountProps => ({
    info: {
        account: 'jdoe',
        accountType: AccountType.USER,
        accountStatus: AccountStatus.ACTIVE,
        email: 'jdoe@example.com',
        createdAt: '2024-03-01T10:00:00Z',
        updatedAt: '2024-04-01T10:00:00Z',
    },
    isSelf: false,
    access: FULL_ACCESS,
    activeTab: 'overview',
    onTabChange: jest.fn(),
    identities: ok(identities),
    attributes: ok(attributes),
    quotas: { isLoading: false },
    ...overrides,
});

const toolbar = () => screen.getByRole('toolbar', { name: 'Actions' });

describe('DetailsAccount', () => {
    it('shows Edit, Suspend, View rules and Delete to an admin on an active account, with tab counts', () => {
        render(<DetailsAccount {...makeProps()} />);
        const bar = within(toolbar());
        expect(bar.getByRole('button', { name: /Edit/ })).toBeInTheDocument();
        expect(bar.getByRole('button', { name: /Suspend/ })).toBeInTheDocument();
        expect(bar.getByRole('button', { name: /Delete/ })).toBeInTheDocument();
        expect(bar.getByRole('link', { name: /View rules/ })).toHaveAttribute('href', '/rules?account=jdoe&autoSearch=true');
        const tabs = screen.getAllByRole('tab').map(t => t.textContent);
        expect(tabs).toEqual(['Overview', 'Identities (2)', 'Attributes (2)', 'Quotas and usage']);
    });

    it('is read-only for a non-admin viewing their own account', () => {
        render(<DetailsAccount {...makeProps({ isSelf: true, access: NO_MANAGE_ACCESS, activeTab: 'identities' })} />);
        const bar = within(toolbar());
        expect(bar.queryByRole('button')).not.toBeInTheDocument();
        expect(bar.getByRole('link', { name: /View rules/ })).toBeInTheDocument();
        expect(screen.getByText('You')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Add identity/ })).not.toBeInTheDocument();
    });

    it('hides Edit, Suspend and Delete but keeps the tab actions when account changes are off', () => {
        render(<DetailsAccount {...makeProps({ access: { ...FULL_ACCESS, edit: false, delete: false }, activeTab: 'identities' })} />);
        expect(within(toolbar()).queryByRole('button')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Add identity/ })).toBeInTheDocument();
    });

    it.each([
        ['identities', 'identities', /Add identity/],
        ['attributes', 'attributes', /Add attribute/],
        ['quotas', 'quotas', /Set quota/],
    ] as const)('hides only the %s actions when that area is off', (area, tab, addButton) => {
        render(<DetailsAccount {...makeProps({ access: { ...FULL_ACCESS, [area]: false }, activeTab: tab })} />);
        expect(screen.queryByRole('button', { name: addButton })).not.toBeInTheDocument();
        expect(within(toolbar()).getByRole('button', { name: /Edit/ })).toBeInTheDocument();
    });

    it('hides the Attributes add button for non-admins', () => {
        render(<DetailsAccount {...makeProps({ access: NO_MANAGE_ACCESS, activeTab: 'attributes' })} />);
        expect(screen.queryByRole('button', { name: /Add attribute/ })).not.toBeInTheDocument();
    });

    it('shows a banner with Reactivate, only the Overview tab and no Delete for a suspended account', () => {
        const onSetStatus = jest.fn();
        render(
            <DetailsAccount
                {...makeProps({
                    info: { ...makeProps().info, accountStatus: AccountStatus.SUSPENDED, suspendedAt: '2026-10-01T00:00:00Z' },
                    identities: { isLoading: false },
                    attributes: { isLoading: false },
                    activeTab: 'identities',
                    onSetStatus,
                })}
            />,
        );
        const banner = screen.getByRole('status');
        expect(banner).toHaveTextContent(/This account is suspended since/);
        fireEvent.click(within(banner).getByRole('button', { name: 'Reactivate' }));
        expect(onSetStatus).toHaveBeenCalledWith('reactivate');
        expect(screen.getAllByRole('tab').map(t => t.textContent)).toEqual(['Overview']);
        expect(within(toolbar()).queryByRole('button', { name: /Delete/ })).not.toBeInTheDocument();
        expect(within(toolbar()).queryByRole('button', { name: /Suspend/ })).not.toBeInTheDocument();
        // the identities panel is not rendered even though it was requested
        expect(screen.queryByText(/no identities/)).not.toBeInTheDocument();
    });

    it('offers no Reactivate to non-admins on a suspended account', () => {
        render(
            <DetailsAccount
                {...makeProps({
                    info: { ...makeProps().info, accountStatus: AccountStatus.SUSPENDED },
                    isSelf: true,
                    access: NO_MANAGE_ACCESS,
                })}
            />,
        );
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Reactivate' })).not.toBeInTheDocument();
    });

    it('shows an empty state with an Add button for an admin when there are no identities', () => {
        const onAddIdentity = jest.fn();
        render(<DetailsAccount {...makeProps({ identities: ok([]), activeTab: 'identities', onAddIdentity })} />);
        expect(screen.getByText('This account has no identities, so nobody can log in to it.')).toBeInTheDocument();
        fireEvent.click(screen.getAllByRole('button', { name: /Add identity/ })[0]);
        expect(onAddIdentity).toHaveBeenCalled();
    });

    it('shows the empty identities state without an Add button for a non-admin', () => {
        render(<DetailsAccount {...makeProps({ identities: ok([]), activeTab: 'identities', access: NO_MANAGE_ACCESS, isSelf: true })} />);
        expect(screen.getByText('This account has no identities, so nobody can log in to it.')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Add identity/ })).not.toBeInTheDocument();
    });

    it('renders an Admin badge in the header only when the admin attribute is truthy', () => {
        const { unmount } = render(<DetailsAccount {...makeProps()} />);
        expect(within(screen.getByRole('banner')).getByText('Admin')).toBeInTheDocument();
        unmount();
        render(<DetailsAccount {...makeProps({ attributes: ok([{ key: 'admin', value: false }]) })} />);
        expect(within(screen.getByRole('banner')).queryByText('Admin')).not.toBeInTheDocument();
    });

    it('disables the actions while a mutation is pending', () => {
        render(<DetailsAccount {...makeProps({ busy: true })} />);
        const bar = within(toolbar());
        expect(bar.getByRole('button', { name: /Edit/ })).toBeDisabled();
        expect(bar.getByRole('button', { name: /Suspend/ })).toBeDisabled();
        expect(bar.getByRole('button', { name: /Delete/ })).toBeDisabled();
    });

    it('reports tab switches', () => {
        const onTabChange = jest.fn();
        render(<DetailsAccount {...makeProps({ onTabChange })} />);
        fireEvent.click(screen.getByRole('tab', { name: 'Quotas and usage' }));
        expect(onTabChange).toHaveBeenCalledWith('quotas');
    });

    it('switches tabs from the overview summary tiles', () => {
        const onTabChange = jest.fn();
        render(<DetailsAccount {...makeProps({ onTabChange })} />);
        fireEvent.click(screen.getByRole('button', { name: /2 identities/i }));
        expect(onTabChange).toHaveBeenCalledWith('identities');
    });

    it('shows a Retry warning for a failed tab and calls onRetry', () => {
        const onRetry = jest.fn();
        render(
            <DetailsAccount
                {...makeProps({
                    activeTab: 'identities',
                    identities: { isLoading: false, error: { errorType: 'unknown', message: 'Rucio is down' }, onRetry },
                })}
            />,
        );
        expect(screen.getByText('Rucio is down')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
        expect(onRetry).toHaveBeenCalled();
    });

    it('shows a permission message without Retry when access is denied', () => {
        render(
            <DetailsAccount
                {...makeProps({
                    activeTab: 'attributes',
                    attributes: { isLoading: false, error: { errorType: 'permission_denied', message: 'Not allowed' }, onRetry: jest.fn() },
                })}
            />,
        );
        expect(screen.getByText('Not allowed')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
    });

    it('shows Set quota for admins and the precedence footnote on the quotas tab', () => {
        const onSetLimit = jest.fn();
        render(<DetailsAccount {...makeProps({ activeTab: 'quotas', quotas: ok({ local: [], global: [] }), onSetLimit })} />);
        expect(
            screen.getByText(
                'Each RSE needs a local quota. Global quotas add a shared cap across the RSEs their expression matches. Accounts with the admin attribute are not limited by quotas.',
            ),
        ).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /Set quota/ }));
        expect(onSetLimit).toHaveBeenCalledWith(undefined);
    });

    it('has a collapsible About identities banner without em dashes', () => {
        const { container } = render(<DetailsAccount {...makeProps({ activeTab: 'identities' })} />);
        const toggle = screen.getByRole('button', { name: /About identities/ });
        expect(toggle).toHaveAttribute('aria-expanded', 'false');
        fireEvent.click(toggle);
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByText(/Passwords cannot be changed/)).toBeInTheDocument();
        expect(container.textContent).not.toContain(EM_DASH);
    });

    it('uses no em dashes in a suspended account view', () => {
        const { container } = render(
            <DetailsAccount
                {...makeProps({ info: { ...makeProps().info, accountStatus: AccountStatus.DELETED, deletedAt: '2026-10-01T00:00:00Z' } })}
            />,
        );
        expect(screen.getByRole('status')).toHaveTextContent(/deleted/);
        expect(container.textContent).not.toContain(EM_DASH);
    });
});
