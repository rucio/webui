import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { DetailsAccount, DetailsAccountProps } from './DetailsAccount';
import { AccountQuotas, AccountTab } from './details-account-types';
import { Toaster } from '@/component-library/atoms/toast/Toaster';
import { AccountStatus, AccountType } from '@/lib/core/entity/rucio';
import { AccountAttribute, AccountIdentity, IdentityType } from '@/lib/core/entity/account';

const identities: AccountIdentity[] = [
    { identity: 'CN=Jane Doe,OU=Users,DC=example,DC=org', type: IdentityType.X509, email: 'jdoe@example.com' },
    { identity: '/DC=org/DC=example/OU=Users/CN=Jane Doe', type: IdentityType.X509, email: 'jdoe@example.com' },
    { identity: 'SUB=1234-abcd, ISS=https://iam.example.org/', type: IdentityType.OIDC, email: 'jdoe@example.com' },
    { identity: 'jdoe', type: IdentityType.USERPASS, email: 'jdoe@example.com' },
];

const attributes: AccountAttribute[] = [
    { key: 'admin', value: true },
    { key: 'country-ch', value: 'user' },
    { key: 'sign-gcs', value: false },
];

const quotas: AccountQuotas = {
    local: [
        { rse: 'CERN-PROD_DATADISK', bytesLimit: 10e12, bytesUsed: 4.2e12, files: 1520, bytesRemaining: 5.8e12 },
        { rse: 'BNL-OSG2_DATADISK', bytesLimit: -1, bytesUsed: 2.1e12, files: 800, bytesRemaining: null },
        { rse: 'DESY-HH_SCRATCHDISK', bytesLimit: null, bytesUsed: 3e11, files: 42, bytesRemaining: null },
        { rse: 'TOKYO-LCG2_DATADISK', bytesLimit: 1e12, bytesUsed: 9.5e11, files: 120, bytesRemaining: 5e10 },
        { rse: 'IN2P3-CC_DATADISK', bytesLimit: 1e12, bytesUsed: 1.2e12, files: 300, bytesRemaining: -2e11 },
    ],
    global: [
        {
            rseExpression: 'tier=1&type=DATADISK',
            resolvedRses: ['BNL-OSG2_DATADISK', 'IN2P3-CC_DATADISK', 'TOKYO-LCG2_DATADISK'],
            bytesLimit: 50e12,
            bytesUsed: 4.25e12,
            files: 1220,
            bytesRemaining: 45.75e12,
        },
    ],
};

const info: DetailsAccountProps['info'] = {
    account: 'jdoe',
    accountType: AccountType.USER,
    accountStatus: AccountStatus.ACTIVE,
    email: 'jdoe@example.com',
    createdAt: '2024-03-01T10:15:00Z',
    updatedAt: '2026-09-12T08:00:00Z',
};

const base: DetailsAccountProps = {
    info,
    isSelf: false,
    canManage: true,
    canLifecycle: true,
    activeTab: 'overview',
    onTabChange: () => {},
    identities: { data: identities, isLoading: false },
    attributes: { data: attributes, isLoading: false },
    quotas: { data: quotas, isLoading: false },
};

/** Keeps the tab in local state so the tabs are clickable in Storybook. */
const Stateful = (args: DetailsAccountProps) => {
    const [tab, setTab] = useState<AccountTab>(args.activeTab);
    return <DetailsAccount {...args} activeTab={tab} onTabChange={setTab} />;
};

const meta: Meta<typeof DetailsAccount> = {
    title: 'Components/Pages/Account/Details/DetailsAccount',
    component: DetailsAccount,
    render: args => <Stateful {...args} />,
    decorators: [
        Story => (
            <>
                <div className="p-6">
                    <Story />
                </div>
                <Toaster />
            </>
        ),
    ],
};
export default meta;
type Story = StoryObj<typeof DetailsAccount>;

export const AdminActiveUser: Story = { args: base };

export const AdminSuspended: Story = {
    args: {
        ...base,
        info: { ...info, accountStatus: AccountStatus.SUSPENDED, suspendedAt: '2026-10-01T09:30:00Z' },
        identities: { isLoading: false },
        attributes: { isLoading: false },
        quotas: { isLoading: false },
    },
};

export const SelfReadOnly: Story = {
    args: {
        ...base,
        isSelf: true,
        canManage: false,
        canLifecycle: false,
        attributes: { data: [{ key: 'country-ch', value: 'user' }], isLoading: false },
    },
};

export const NoIdentities: Story = {
    args: { ...base, activeTab: 'identities', identities: { data: [], isLoading: false } },
};

export const QuotasEdgeCases: Story = {
    args: { ...base, activeTab: 'quotas' },
};

/** A stored global expression matches no RSEs, so Rucio cannot list the global quotas. */
export const QuotasGlobalUnavailable: Story = {
    args: {
        ...base,
        activeTab: 'quotas',
        quotas: {
            isLoading: false,
            data: {
                ...quotas,
                global: [],
                globalError:
                    'Rucio could not list the global quotas: RSE Expression resulted in an empty set. One of them uses an RSE expression that no longer matches any RSE. Remove it by its expression to list the others again.',
            },
        },
    },
};

export const TabErrors: Story = {
    args: {
        ...base,
        activeTab: 'identities',
        identities: { isLoading: false, error: { errorType: 'unknown', message: 'The Rucio server could not be reached.' }, onRetry: () => {} },
        attributes: {
            isLoading: false,
            error: { errorType: 'permission_denied', message: 'You do not have permission to read the attributes of this account.' },
        },
        quotas: { isLoading: false, error: { errorType: 'unknown', message: 'One of the quota requests failed.' }, onRetry: () => {} },
    },
};

export const Loading: Story = {
    args: { ...base, activeTab: 'identities', identities: { isLoading: true }, attributes: { isLoading: true }, quotas: { isLoading: true } },
};
