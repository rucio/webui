import type { Meta, StoryObj } from '@storybook/nextjs';
import { AccountStatusBadge } from './AccountStatusBadge';
import { AccountStatus } from '@/lib/core/entity/rucio';

const meta: Meta<typeof AccountStatusBadge> = {
    title: 'Features/Badges/Account/AccountStatusBadge',
    component: AccountStatusBadge,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AccountStatusBadge>;

export const Default: Story = {
    args: { value: AccountStatus.ACTIVE },
};

export const AllValues: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            {Object.values(AccountStatus).map(value => (
                <AccountStatusBadge key={value} value={value} />
            ))}
        </div>
    ),
};
