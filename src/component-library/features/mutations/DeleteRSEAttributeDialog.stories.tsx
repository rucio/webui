import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { DeleteRSEAttributeDialog } from './DeleteRSEAttributeDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const meta: Meta<typeof DeleteRSEAttributeDialog> = {
    title: 'Features/Mutations/DeleteRSEAttributeDialog',
    component: DeleteRSEAttributeDialog,
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
type Story = StoryObj<typeof DeleteRSEAttributeDialog>;

const DeleteAttributeWrapper = ({
    attributeKey = 'fts',
    attributeValue,
    loading = false,
}: {
    attributeKey?: string;
    attributeValue?: string;
    loading?: boolean;
}) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="error" onClick={() => setOpen(true)}>
                Delete Attribute
            </Button>
            <DeleteRSEAttributeDialog
                open={open}
                onOpenChange={setOpen}
                rseName="CERN-DISK"
                attributeKey={attributeKey}
                attributeValue={attributeValue}
                onConfirm={() => {
                    alert(`Attribute '${attributeKey}' deleted!`);
                    setOpen(false);
                }}
                loading={loading}
            />
        </>
    );
};

export const Default: Story = {
    render: () => <DeleteAttributeWrapper attributeValue="https://fts3.cern.ch:8446" />,
};

export const WithoutValue: Story = {
    render: () => <DeleteAttributeWrapper />,
};

export const LongValue: Story = {
    render: () => (
        <DeleteAttributeWrapper
            attributeKey="endpoint_url"
            attributeValue="https://very-long-hostname.subdomain.example.cern.ch:8446/api/v1/transfers"
        />
    ),
};

export const Loading: Story = {
    render: () => <DeleteAttributeWrapper attributeValue="https://fts3.cern.ch:8446" loading />,
};
