import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { within, userEvent } from 'storybook/test';
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

const Wrapper = ({ openInitially = false, ...props }: WrapperProps & { openInitially?: boolean }) => {
    const [open, setOpen] = useState(openInitially);
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

/** The play function enters invalid input so the inline error is visible. */
export const ValidationErrors: Story = {
    render: () => <Wrapper openInitially />,
    play: async () => {
        const body = within(document.body);
        await userEvent.type(await body.findByLabelText(/^Limit/), '-5');
    },
};

export const Loading: Story = { render: () => <Wrapper loading /> };

export const ServerError: Story = { render: () => <Wrapper error="This RSE expression matches no RSE." /> };

export const RsesLoading: Story = { render: () => <Wrapper rses={[]} rsesLoading openInitially /> };

export const RsesError: Story = {
    render: () => (
        <Wrapper rses={[]} rsesError="Could not load the RSE list. Try again later, or set a global limit with an RSE expression." openInitially />
    ),
};
