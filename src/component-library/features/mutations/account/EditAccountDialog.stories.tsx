import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { within, userEvent } from 'storybook/test';
import { EditAccountDialog, EditAccountDialogProps } from './EditAccountDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Toaster } from '@/component-library/atoms/toast/Toaster';
import { AccountType } from '@/lib/core/entity/rucio';

const meta: Meta<typeof EditAccountDialog> = {
    title: 'Features/Mutations/Account/EditAccountDialog',
    component: EditAccountDialog,
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
type Story = StoryObj<typeof EditAccountDialog>;

type WrapperProps = Partial<Omit<EditAccountDialogProps, 'open' | 'onOpenChange'>>;

const Wrapper = ({ openInitially = false, ...props }: WrapperProps & { openInitially?: boolean }) => {
    const [open, setOpen] = useState(openInitially);
    return (
        <>
            <Button variant="default" onClick={() => setOpen(true)}>
                Edit account
            </Button>
            <EditAccountDialog
                account="jdoe"
                initial={{ accountType: AccountType.USER, email: 'jane.doe@example.org' }}
                onSubmit={() => setOpen(false)}
                {...props}
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
};
export const Default: Story = { render: () => <Wrapper /> };

/** The play function enters invalid input so the inline error is visible. */
export const ValidationErrors: Story = {
    render: () => <Wrapper openInitially />,
    play: async () => {
        const body = within(document.body);
        const email = await body.findByLabelText(/Email/);
        await userEvent.clear(email);
        await userEvent.type(email, 'nope');
    },
};

export const Loading: Story = { render: () => <Wrapper loading /> };

export const ServerError: Story = { render: () => <Wrapper error="You do not have permission to edit this account." /> };
