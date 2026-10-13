import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { SetAccountLimitDialog, SetAccountLimitDialogProps } from './SetAccountLimitDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const meta: Meta<typeof SetAccountLimitDialog> = {
    title: 'Features/Mutations/Account/SetAccountLimitDialog',
    component: SetAccountLimitDialog,
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
type Story = StoryObj<typeof SetAccountLimitDialog>;

type WrapperProps = Partial<Omit<SetAccountLimitDialogProps, 'open' | 'onOpenChange'>>;

const Wrapper = (props: WrapperProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="default" onClick={() => setOpen(true)}>
                Set limit
            </Button>
            <SetAccountLimitDialog
                account="jdoe"
                rses={['CERN-DISK', 'BNL-DISK', 'FZK-DISK']}
                onSubmit={() => setOpen(false)}
                {...props}
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
};
export const Default: Story = { render: () => <Wrapper /> };

export const EditMode: Story = {
    render: () => <Wrapper initial={{ locality: 'local', rseExpression: 'CERN-DISK', bytes: 2_000_000_000_000 }} />,
};

export const EditUnlimited: Story = {
    render: () => <Wrapper initial={{ locality: 'global', rseExpression: 'tier=1', bytes: -1 }} />,
};

// Enter a negative amount to see the inline error.
export const ValidationErrors: Story = { render: () => <Wrapper /> };

export const Loading: Story = { render: () => <Wrapper loading /> };

export const ServerError: Story = { render: () => <Wrapper error="This RSE expression matches no RSE." /> };
