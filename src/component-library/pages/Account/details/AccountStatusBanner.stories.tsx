import type { Meta, StoryObj } from '@storybook/nextjs';
import { AccountStatusBanner } from './AccountStatusBanner';
import { AccountStatus } from '@/lib/core/entity/rucio';

const meta: Meta<typeof AccountStatusBanner> = {
    title: 'Components/Pages/Account/Details/AccountStatusBanner',
    component: AccountStatusBanner,
    parameters: { docs: { disable: true } },
};
export default meta;
type Story = StoryObj<typeof AccountStatusBanner>;

export const Suspended: Story = {
    args: { status: AccountStatus.SUSPENDED, suspendedAt: '2026-10-01T09:30:00Z', canReactivate: true },
};

export const Deleted: Story = {
    args: { status: AccountStatus.DELETED, deletedAt: '2026-10-05T14:00:00Z', canReactivate: true },
};

export const SuspendedReadOnly: Story = {
    args: { status: AccountStatus.SUSPENDED, suspendedAt: '2026-10-01T09:30:00Z', canReactivate: false },
};

export const Busy: Story = {
    args: { status: AccountStatus.SUSPENDED, suspendedAt: '2026-10-01T09:30:00Z', canReactivate: true, busy: true },
};
