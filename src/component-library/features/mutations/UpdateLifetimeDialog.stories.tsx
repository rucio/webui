import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { within, userEvent } from 'storybook/test';
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
    minLifetimeSeconds,
    isAdmin,
    openInitially = false,
}: {
    currentExpiresAt?: string | null;
    loading?: boolean;
    canSetInfinite?: boolean;
    maxLifetimeSeconds?: number;
    minLifetimeSeconds?: number;
    isAdmin?: boolean;
    openInitially?: boolean;
}) => {
    const [open, setOpen] = useState(openInitially);
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
                isAdmin={isAdmin}
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

/**
 * Demonstrates the immediate-deletion destructive warning banner.
 * The play function opens the dialog and enters 0 days / 0 hours so the warning
 * is visible without any manual interaction in Storybook.
 */
export const ZeroLifetimeWarning: Story = {
    name: 'Zero Lifetime (immediate deletion warning)',
    render: () => <UpdateLifetimeWrapper currentExpiresAt="2026-12-31T00:00:00Z" canSetInfinite openInitially />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const daysInput = await canvas.findByLabelText('Days');
        await userEvent.clear(daysInput);
        await userEvent.type(daysInput, '0');
        const hoursInput = canvas.getByLabelText('Hours');
        await userEvent.clear(hoursInput);
        await userEvent.type(hoursInput, '0');
    },
};

/**
 * Demonstrates the short-lifetime warning banner (< 1 hour).
 * The play function opens the dialog in date mode and fills in a datetime ~45 minutes
 * from now so the warning is visible without any manual interaction in Storybook.
 */
export const ShortLifetimeWarning: Story = {
    name: 'Short Lifetime Warning (< 1 hour, date mode)',
    render: () => <UpdateLifetimeWrapper currentExpiresAt="2026-12-31T00:00:00Z" canSetInfinite openInitially />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Switch to date mode
        const dateRadio = canvas.getByRole('radio', { name: /Set by date/ });
        await userEvent.click(dateRadio);
        // Enter a date 45 minutes from now (short lifetime: 0 < t < 3600 s)
        const now = new Date();
        const target = new Date(now.getTime() + 45 * 60 * 1000);
        const pad = (n: number) => String(n).padStart(2, '0');
        const localStr = `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}T${pad(target.getHours())}:${pad(target.getMinutes())}`;
        const dateInput = canvas.getByLabelText(/Expiry date/);
        await userEvent.clear(dateInput);
        await userEvent.type(dateInput, localStr);
    },
};

/**
 * The caller can still enforce an explicit minimum by passing minLifetimeSeconds > 0.
 * This story demonstrates a policy-constrained setup (24 h minimum, 1 year cap, no infinite).
 */
export const PolicyConstrained: Story = {
    name: 'Policy-constrained (24 h min, 1 year max, no infinite)',
    render: () => (
        <UpdateLifetimeWrapper
            currentExpiresAt="2026-12-31T00:00:00Z"
            canSetInfinite={false}
            maxLifetimeSeconds={365 * 86400}
            minLifetimeSeconds={24 * 3600}
        />
    ),
};

/**
 * Non-admin users see the policy advisory banner noting the server may override their choice.
 */
export const NonAdminPolicyAdvisory: Story = {
    name: 'Non-admin (policy advisory banner)',
    render: () => <UpdateLifetimeWrapper currentExpiresAt="2026-12-31T00:00:00Z" isAdmin={false} />,
};

/**
 * Admin users do not see the policy advisory banner.
 */
export const AdminUser: Story = {
    name: 'Admin (no policy advisory, can clear lifetime)',
    render: () => <UpdateLifetimeWrapper currentExpiresAt="2026-12-31T00:00:00Z" canSetInfinite isAdmin />,
};
