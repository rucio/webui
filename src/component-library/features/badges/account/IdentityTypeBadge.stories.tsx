import type { Meta, StoryObj } from '@storybook/nextjs';
import { IdentityTypeBadge } from './IdentityTypeBadge';
import { IdentityType } from '@/lib/core/entity/account';

const meta: Meta<typeof IdentityTypeBadge> = {
    title: 'Features/Badges/Account/IdentityTypeBadge',
    component: IdentityTypeBadge,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IdentityTypeBadge>;

export const Default: Story = {
    args: { value: IdentityType.X509 },
};

export const AllValues: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            {Object.values(IdentityType).map(value => (
                <IdentityTypeBadge key={value} value={value} />
            ))}
        </div>
    ),
};
