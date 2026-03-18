import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { AddRSEAttributeDialog } from './AddRSEAttributeDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const meta: Meta<typeof AddRSEAttributeDialog> = {
    title: 'Features/Mutations/AddRSEAttributeDialog',
    component: AddRSEAttributeDialog,
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
type Story = StoryObj<typeof AddRSEAttributeDialog>;

const AddAttributeWrapper = ({ existingKeys = ['fts', 'site', 'tier'], loading = false }: { existingKeys?: string[]; loading?: boolean }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)}>Add Attribute</Button>
            <AddRSEAttributeDialog
                open={open}
                onOpenChange={setOpen}
                rseName="CERN-DISK"
                existingKeys={existingKeys}
                onConfirm={(key, value) => {
                    alert(`Added attribute: ${key} = ${value}`);
                    setOpen(false);
                }}
                loading={loading}
            />
        </>
    );
};

export const Default: Story = {
    render: () => <AddAttributeWrapper />,
};

export const NoExistingKeys: Story = {
    render: () => <AddAttributeWrapper existingKeys={[]} />,
};

export const Loading: Story = {
    render: () => <AddAttributeWrapper loading />,
};
