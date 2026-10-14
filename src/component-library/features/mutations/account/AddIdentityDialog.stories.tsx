import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { within, userEvent } from 'storybook/test';
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

const Wrapper = ({ openInitially = false, ...props }: WrapperProps & { openInitially?: boolean }) => {
    const [open, setOpen] = useState(openInitially);
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

/** The play function enters invalid input so the inline error is visible. */
export const UserpassMismatch: Story = {
    render: () => <Wrapper openInitially />,
    play: async () => {
        const body = within(document.body);
        await userEvent.click(await body.findByLabelText(/^Type/));
        await userEvent.click(await body.findByRole('option', { name: 'Username and password' }));
        await userEvent.type(body.getByLabelText(/^Identity/), 'jdoe');
        await userEvent.type(body.getByLabelText(/^Password/), 'fake-password');
        await userEvent.type(body.getByLabelText(/Confirm password/), 'different');
    },
};

// Choose "SSH key" to get the multi-line field.
export const SshKey: Story = { render: () => <Wrapper /> };

export const Loading: Story = { render: () => <Wrapper loading /> };

export const ServerError: Story = { render: () => <Wrapper error="This identity is already linked to the account." /> };
