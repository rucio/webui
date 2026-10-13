import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { AddIdentityDialog, AddIdentityDialogProps } from './AddIdentityDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const meta: Meta<typeof AddIdentityDialog> = {
    title: 'Features/Mutations/Account/AddIdentityDialog',
    component: AddIdentityDialog,
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
type Story = StoryObj<typeof AddIdentityDialog>;

type WrapperProps = Partial<Omit<AddIdentityDialogProps, 'open' | 'onOpenChange'>>;

const Wrapper = (props: WrapperProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="default" onClick={() => setOpen(true)}>
                Add identity
            </Button>
            <AddIdentityDialog account="jdoe" onSubmit={() => setOpen(false)} {...props} open={open} onOpenChange={setOpen} />
        </>
    );
};
export const Default: Story = { render: () => <Wrapper /> };

// Choose "Username and password" and enter different passwords to see the mismatch error.
export const UserpassMismatch: Story = { render: () => <Wrapper /> };

// Choose "SSH key" to get the multi-line field.
export const SshKey: Story = { render: () => <Wrapper /> };

export const Loading: Story = { render: () => <Wrapper loading /> };

export const ServerError: Story = { render: () => <Wrapper error="This identity is already linked to the account." /> };
