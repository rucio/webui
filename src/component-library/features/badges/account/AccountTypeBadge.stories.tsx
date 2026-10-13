import type { Meta, StoryObj } from '@storybook/nextjs';
import { AccountTypeBadge } from './AccountTypeBadge';
import { AccountType } from '@/lib/core/entity/rucio';

const meta: Meta<typeof AccountTypeBadge> = {
    title: 'Features/Badges/Account/AccountTypeBadge',
    component: AccountTypeBadge,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AccountTypeBadge>;

export const Default: Story = {
    args: { value: AccountType.USER },
};

export const AllValues: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            {Object.values(AccountType).map(value => (
                <AccountTypeBadge key={value} value={value} />
            ))}
        </div>
    ),
};
