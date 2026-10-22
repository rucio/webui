import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { EditAccountAttributeDialog, EditAccountAttributeDialogProps } from './EditAccountAttributeDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { Toaster } from '@/component-library/atoms/toast/Toaster';
import { isValidAccountAttribute } from '@/lib/core/utils/account-validation';

const meta: Meta<typeof EditAccountAttributeDialog> = {
    title: 'Features/Mutations/AccountAttributes/EditAccountAttributeDialog',
    component: EditAccountAttributeDialog,
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
type Story = StoryObj<typeof EditAccountAttributeDialog>;

type WrapperProps = Partial<Omit<EditAccountAttributeDialogProps, 'open' | 'onOpenChange'>>;

const Wrapper = (props: WrapperProps) => {
    const [open, setOpen] = useState(true);
    return (
        <>
            <Button onClick={() => setOpen(true)}>Edit attribute</Button>
            <EditAccountAttributeDialog
                entityName="jdoe"
                attributeKey="country-ch"
                currentValue="user"
                validateValue={value => (isValidAccountAttribute(value) ? undefined : 'Use up to 30 letters, digits, and - _ \\ / . characters')}
                onConfirm={() => setOpen(false)}
                {...props}
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
};

/** The warning that Edit is a delete and create operation is always shown. */
export const Default: Story = {
    render: () => <Wrapper />,
};

export const AdminAttribute: Story = {
    render: () => (
        <Wrapper
            attributeKey="admin"
            currentValue="True"
            warning={<Alert variant="warning" message="Role changes apply after the account's next login." />}
        />
    ),
};

export const Loading: Story = {
    render: () => <Wrapper loading />,
};

export const ServerError: Story = {
    render: () => <Wrapper error="The new value could not be saved. The previous value was restored." />,
};
