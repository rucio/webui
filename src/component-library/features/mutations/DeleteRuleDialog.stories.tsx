import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { DeleteRuleDialog } from './DeleteRuleDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const meta: Meta<typeof DeleteRuleDialog> = {
    title: 'Features/Mutations/DeleteRuleDialog',
    component: DeleteRuleDialog,
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
type Story = StoryObj<typeof DeleteRuleDialog>;

const DeleteRuleWrapper = ({
    loading = false,
    defaultForceDelete = false,
    openInitially = false,
}: {
    loading?: boolean;
    defaultForceDelete?: boolean;
    openInitially?: boolean;
}) => {
    const [open, setOpen] = useState(openInitially);
    return (
        <>
            <Button variant="error" onClick={() => setOpen(true)}>
                Delete Rule
            </Button>
            <DeleteRuleDialog
                open={open}
                onOpenChange={setOpen}
                ruleId="8a7b6c5d4e3f2a1b"
                defaultForceDelete={defaultForceDelete}
                onConfirm={(forceDelete: boolean) => {
                    alert(`Rule deleted! forceDelete=${forceDelete}`);
                    setOpen(false);
                }}
                loading={loading}
            />
        </>
    );
};

/**
 * Standard dialog with the force-delete checkbox visible to all users.
 * Defaults to unchecked (soft-delete, lifetime=3600). No warning banner is shown.
 */
export const Default: Story = {
    render: () => <DeleteRuleWrapper />,
};

/**
 * Dialog opened with the force-delete checkbox pre-checked.
 * The destructive error banner is displayed below the checkbox, warning the user
 * that the rule will be deleted immediately with no grace period (lifetime=0).
 * The info tip also updates to reflect the immediate-deletion mode.
 */
export const ForceDeleteChecked: Story = {
    render: () => <DeleteRuleWrapper defaultForceDelete openInitially />,
};

/**
 * Dialog in the loading state while a delete mutation is in progress.
 */
export const Loading: Story = {
    render: () => <DeleteRuleWrapper loading />,
};
