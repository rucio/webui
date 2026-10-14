import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
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

const Wrapper = (props: WrapperProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)}>Add attribute</Button>
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

export const NoExistingKeys: Story = {
    render: () => <Wrapper {...accountProps} existingKeys={[]} />,
};

export const Loading: Story = {
    render: () => <Wrapper {...accountProps} loading />,
};

export const ServerError: Story = {
    render: () => <Wrapper {...accountProps} error="You do not have permission to change attributes on this account." />,
};
