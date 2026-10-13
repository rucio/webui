import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { DeleteAccountDialog, DeleteAccountDialogProps } from './DeleteAccountDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const meta: Meta<typeof DeleteAccountDialog> = {
    title: 'Features/Mutations/Account/DeleteAccountDialog',
    component: DeleteAccountDialog,
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
type Story = StoryObj<typeof DeleteAccountDialog>;

type WrapperProps = Partial<Omit<DeleteAccountDialogProps, 'open' | 'onOpenChange'>>;

const Wrapper = (props: WrapperProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="error" onClick={() => setOpen(true)}>
                Delete account
            </Button>
            <DeleteAccountDialog account="jdoe" onSubmit={() => setOpen(false)} {...props} open={open} onOpenChange={setOpen} />
        </>
    );
};
export const Default: Story = { render: () => <Wrapper /> };

// Type a name that does not match exactly to keep the button disabled.
export const ValidationErrors: Story = { render: () => <Wrapper /> };

export const Loading: Story = { render: () => <Wrapper loading /> };

export const ServerError: Story = { render: () => <Wrapper error="This account still owns rules and cannot be deleted." /> };
