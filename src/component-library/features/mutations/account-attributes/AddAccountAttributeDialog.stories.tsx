import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { HiPlus } from 'react-icons/hi';
import { within, userEvent } from 'storybook/test';
import { AddAccountAttributeDialog, AddAccountAttributeDialogProps } from './AddAccountAttributeDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { Toaster } from '@/component-library/atoms/toast/Toaster';
import { isValidAccountAttribute } from '@/lib/core/utils/account-validation';

const meta: Meta<typeof AddAccountAttributeDialog> = {
    title: 'Features/Mutations/AccountAttributes/AddAccountAttributeDialog',
    component: AddAccountAttributeDialog,
    parameters: {
        layout: 'centered',
    },
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
type Story = StoryObj<typeof AddAccountAttributeDialog>;

type WrapperProps = Partial<Omit<AddAccountAttributeDialogProps, 'open' | 'onOpenChange'>>;

const Wrapper = ({ openInitially = false, ...props }: WrapperProps & { openInitially?: boolean }) => {
    const [open, setOpen] = useState(openInitially);
    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <HiPlus className="mr-1 h-4 w-4" aria-hidden="true" />
                Add attribute
            </Button>
            <AddAccountAttributeDialog
                entityName="jdoe"
                existingKeys={['country']}
                onConfirm={() => setOpen(false)}
                {...props}
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
};

const accountProps: WrapperProps = {
    keyPlaceholder: 'e.g., country',
    valuePlaceholder: 'e.g., CH',
    validateKey: key => (isValidAccountAttribute(key) ? undefined : 'Use up to 30 letters, digits, and - _ \\ / . characters'),
    validateValue: value => (isValidAccountAttribute(value) ? undefined : 'Use up to 30 letters, digits, and - _ \\ / . characters'),
    warning: ({ key }) =>
        key === 'admin' ? <Alert variant="warning" message="The admin attribute grants administrator rights to this account." /> : null,
};

export const Default: Story = {
    render: () => <Wrapper {...accountProps} />,
};

/** The account already has these keys; the play function enters one of them to show the duplicate error. */
export const DuplicateKey: Story = {
    render: () => <Wrapper {...accountProps} existingKeys={['admin', 'country', 'group']} openInitially />,
    play: async () => {
        const body = within(document.body);
        await userEvent.type(await body.findByLabelText(/^Key/), 'country');
        await userEvent.type(body.getByLabelText(/^Value/), 'CH');
    },
};

export const Loading: Story = {
    render: () => <Wrapper {...accountProps} loading />,
};

export const ServerError: Story = {
    render: () => <Wrapper {...accountProps} error="You do not have permission to change attributes on this account." />,
};
