import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { SetAccountStatusDialog, SetAccountStatusDialogProps } from './SetAccountStatusDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const meta: Meta<typeof SetAccountStatusDialog> = {
    title: 'Features/Mutations/Account/SetAccountStatusDialog',
    component: SetAccountStatusDialog,
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
type Story = StoryObj<typeof SetAccountStatusDialog>;

type WrapperProps = Partial<Omit<SetAccountStatusDialogProps, 'open' | 'onOpenChange'>>;

const Wrapper = ({ mode = 'suspend', ...props }: WrapperProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="default" onClick={() => setOpen(true)}>
                Change status
            </Button>
            <SetAccountStatusDialog account="jdoe" onSubmit={() => setOpen(false)} {...props} mode={mode} open={open} onOpenChange={setOpen} />
        </>
    );
};
export const Suspend: Story = { render: () => <Wrapper mode="suspend" /> };

export const Reactivate: Story = { render: () => <Wrapper mode="reactivate" /> };

export const Loading: Story = { render: () => <Wrapper mode="suspend" loading /> };

export const ServerError: Story = { render: () => <Wrapper mode="suspend" error="You do not have permission to change this account." /> };
