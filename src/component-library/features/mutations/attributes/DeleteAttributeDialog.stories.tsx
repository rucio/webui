import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { DeleteAttributeDialog, DeleteAttributeDialogProps } from './DeleteAttributeDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const meta: Meta<typeof DeleteAttributeDialog> = {
    title: 'Features/Mutations/Attributes/DeleteAttributeDialog',
    component: DeleteAttributeDialog,
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
type Story = StoryObj<typeof DeleteAttributeDialog>;

type WrapperProps = Partial<Omit<DeleteAttributeDialogProps, 'open' | 'onOpenChange'>>;

const Wrapper = (props: WrapperProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="error" onClick={() => setOpen(true)}>
                Delete attribute
            </Button>
            <DeleteAttributeDialog
                entityLabel="RSE"
                entityName="CERN-DISK"
                attributeKey="fts"
                onConfirm={() => setOpen(false)}
                {...props}
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
};

export const RSE: Story = {
    render: () => <Wrapper attributeValue="https://fts3.cern.ch:8446" />,
};

export const RSEWithoutValue: Story = {
    render: () => <Wrapper />,
};

export const RSELongValue: Story = {
    render: () => <Wrapper attributeKey="endpoint_url" attributeValue="https://very-long-hostname.subdomain.example.cern.ch:8446/api/v1/transfers" />,
};

export const Account: Story = {
    render: () => <Wrapper entityLabel="account" entityName="jdoe" attributeKey="country" attributeValue="CH" />,
};

export const AccountAdminAttribute: Story = {
    render: () => (
        <Wrapper
            entityLabel="account"
            entityName="jdoe"
            attributeKey="admin"
            attributeValue="True"
            warning={<Alert variant="warning" message="Removing the admin attribute takes away administrator rights from this account." />}
        />
    ),
};

export const Loading: Story = {
    render: () => <Wrapper attributeValue="https://fts3.cern.ch:8446" loading />,
};

export const ServerError: Story = {
    render: () => <Wrapper attributeValue="https://fts3.cern.ch:8446" error="This attribute no longer exists." />,
};
