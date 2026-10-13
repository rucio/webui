import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { within, userEvent } from 'storybook/test';
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

const Wrapper = ({ openInitially = false, ...props }: WrapperProps & { openInitially?: boolean }) => {
    const [open, setOpen] = useState(openInitially);
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

/** The play function enters invalid input so the inline error is visible. */
export const ValidationErrors: Story = {
    render: () => <Wrapper openInitially />,
    play: async () => {
        const body = within(document.body);
        await userEvent.type(await body.findByLabelText(/Type jdoe to confirm/), 'jd');
    },
};

export const Loading: Story = { render: () => <Wrapper loading /> };

export const ServerError: Story = { render: () => <Wrapper error="This account still owns rules and cannot be deleted." /> };
