import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { HiOutlineTrash } from 'react-icons/hi';
import { DeleteAccountAttributeDialog, DeleteAccountAttributeDialogProps } from './DeleteAccountAttributeDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const meta: Meta<typeof DeleteAccountAttributeDialog> = {
    title: 'Features/Mutations/AccountAttributes/DeleteAccountAttributeDialog',
    component: DeleteAccountAttributeDialog,
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
type Story = StoryObj<typeof DeleteAccountAttributeDialog>;

type WrapperProps = Partial<Omit<DeleteAccountAttributeDialogProps, 'open' | 'onOpenChange'>>;

const Wrapper = (props: WrapperProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="error" onClick={() => setOpen(true)}>
                <HiOutlineTrash className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Delete attribute
            </Button>
            <DeleteAccountAttributeDialog
                entityName="jdoe"
                attributeKey="country"
                onConfirm={() => setOpen(false)}
                {...props}
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
};

export const Default: Story = {
    render: () => <Wrapper attributeValue="CH" />,
};

export const WithoutValue: Story = {
    render: () => <Wrapper />,
};

export const LongValue: Story = {
    render: () => <Wrapper attributeKey="affiliation" attributeValue="a-very-long-value-with_many-parts/and/slashes.x" />,
};

export const AccountAdminAttribute: Story = {
    render: () => (
        <Wrapper
            attributeKey="admin"
            attributeValue="True"
            warning={<Alert variant="warning" message="Removing the admin attribute takes away administrator rights from this account." />}
        />
    ),
};

export const Loading: Story = {
    render: () => <Wrapper attributeValue="CH" loading />,
};

export const ServerError: Story = {
    render: () => <Wrapper attributeValue="CH" error="This attribute no longer exists." />,
};
