import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { CreateAccountDialog, CreateAccountDialogProps } from './CreateAccountDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const meta: Meta<typeof CreateAccountDialog> = {
    title: 'Features/Mutations/Account/CreateAccountDialog',
    component: CreateAccountDialog,
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
type Story = StoryObj<typeof CreateAccountDialog>;

type WrapperProps = Partial<Omit<CreateAccountDialogProps, 'open' | 'onOpenChange'>>;

const Wrapper = (props: WrapperProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="default" onClick={() => setOpen(true)}>
                Create account
            </Button>
            <CreateAccountDialog onSubmit={() => setOpen(false)} {...props} open={open} onOpenChange={setOpen} />
        </>
    );
};
export const Default: Story = { render: () => <Wrapper /> };

// Type an invalid name such as "Bad Name!" to see the inline error.
export const ValidationErrors: Story = { render: () => <Wrapper /> };

export const Loading: Story = { render: () => <Wrapper loading /> };

export const ServerError: Story = { render: () => <Wrapper error="An account with this name already exists." /> };
