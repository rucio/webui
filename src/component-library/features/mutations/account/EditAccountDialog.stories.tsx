import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
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

const Wrapper = (props: WrapperProps) => {
    const [open, setOpen] = useState(false);
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

// Enter an invalid email such as "nope" to see the inline error.
export const ValidationErrors: Story = { render: () => <Wrapper /> };

export const Loading: Story = { render: () => <Wrapper loading /> };

export const ServerError: Story = { render: () => <Wrapper error="You do not have permission to edit this account." /> };
