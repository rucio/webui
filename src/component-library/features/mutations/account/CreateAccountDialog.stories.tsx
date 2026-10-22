import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { HiPlus } from 'react-icons/hi';
import { within, userEvent } from 'storybook/test';
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

const Wrapper = ({ openInitially = false, ...props }: WrapperProps & { openInitially?: boolean }) => {
    const [open, setOpen] = useState(openInitially);
    return (
        <>
            <Button variant="default" onClick={() => setOpen(true)}>
                <HiPlus className="mr-1 h-4 w-4" aria-hidden="true" />
                Create account
            </Button>
            <CreateAccountDialog onSubmit={() => setOpen(false)} {...props} open={open} onOpenChange={setOpen} />
        </>
    );
};
export const Default: Story = { render: () => <Wrapper /> };

/** The play function enters invalid input so the inline error is visible. */
export const ValidationErrors: Story = {
    render: () => <Wrapper openInitially />,
    play: async () => {
        const body = within(document.body);
        await userEvent.type(await body.findByLabelText(/Name/), 'Bad Name!');
    },
};

export const Loading: Story = { render: () => <Wrapper loading /> };

export const ServerError: Story = { render: () => <Wrapper error="An account with this name already exists." /> };
