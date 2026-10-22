import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { DeleteAccountLimitDialog, DeleteAccountLimitDialogProps } from './DeleteAccountLimitDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const meta: Meta<typeof DeleteAccountLimitDialog> = {
    title: 'Features/Mutations/Account/DeleteAccountLimitDialog',
    component: DeleteAccountLimitDialog,
    parameters: { layout: 'centered' },
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
type Story = StoryObj<typeof DeleteAccountLimitDialog>;

type WrapperProps = Partial<Omit<DeleteAccountLimitDialogProps, 'open' | 'onOpenChange'>>;

const Wrapper = (props: WrapperProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="error" onClick={() => setOpen(true)}>
                Delete limit
            </Button>
            <DeleteAccountLimitDialog
                account="jdoe"
                locality="local"
                rseExpression="CERN-DISK"
                onSubmit={() => setOpen(false)}
                {...props}
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
};
export const Local: Story = { render: () => <Wrapper /> };

export const Global: Story = { render: () => <Wrapper locality="global" rseExpression="tier=1" /> };

/** Rucio could not list the global quotas, so the expression is typed in. */
export const GlobalByExpression: Story = { render: () => <Wrapper locality="global" rseExpression="" editable /> };

export const Loading: Story = { render: () => <Wrapper loading /> };

export const ServerError: Story = { render: () => <Wrapper error="This limit no longer exists." /> };
