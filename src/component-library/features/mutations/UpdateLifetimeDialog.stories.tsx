import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { UpdateLifetimeDialog } from './UpdateLifetimeDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const meta: Meta<typeof UpdateLifetimeDialog> = {
    title: 'Features/Mutations/UpdateLifetimeDialog',
    component: UpdateLifetimeDialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        Story => (
            <>
                <Story />
                <Toaster />
            </>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof UpdateLifetimeDialog>;

const UpdateLifetimeWrapper = ({
    currentExpiresAt,
    loading = false,
    canSetInfinite = true,
    maxLifetimeSeconds,
}: {
    currentExpiresAt?: string | null;
    loading?: boolean;
    canSetInfinite?: boolean;
    maxLifetimeSeconds?: number;
    minLifetimeSeconds?: number;
}) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)}>Update Lifetime</Button>
            <UpdateLifetimeDialog
                open={open}
                onOpenChange={setOpen}
                ruleId="8a7b6c5d4e3f2a1b"
                currentExpiresAt={currentExpiresAt}
                onConfirm={seconds => {
                    if (seconds === null) {
                        alert('Lifetime cleared!');
                    } else {
                        alert(`Lifetime set to ${seconds} seconds from now`);
                    }
                    setOpen(false);
                }}
                loading={loading}
                canSetInfinite={canSetInfinite}
                maxLifetimeSeconds={maxLifetimeSeconds}
                minLifetimeSeconds={minLifetimeSeconds}
            />
        </>
    );
};

export const Default: Story = {
    render: () => <UpdateLifetimeWrapper currentExpiresAt="2026-12-31T00:00:00Z" />,
};

export const NoCurrentExpiry: Story = {
    render: () => <UpdateLifetimeWrapper currentExpiresAt={null} />,
};

export const Loading: Story = {
    render: () => <UpdateLifetimeWrapper currentExpiresAt="2026-12-31T00:00:00Z" loading />,
};

export const AdminUser: Story = {
    name: 'Admin (infinite lifetime, 0 min)',
    render: () => <UpdateLifetimeWrapper currentExpiresAt="2026-12-31T00:00:00Z" canSetInfinite minLifetimeSeconds={0} />,
};

export const RegularUser: Story = {
    name: 'Regular User (1 year max, 24h min, no infinite)',
    render: () => (
        <UpdateLifetimeWrapper
            currentExpiresAt="2026-12-31T00:00:00Z"
            canSetInfinite={false}
            maxLifetimeSeconds={365 * 86400}
            minLifetimeSeconds={24 * 3600}
        />
    ),
};
