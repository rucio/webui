import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { UpdatePriorityDialog } from './UpdatePriorityDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const meta: Meta<typeof UpdatePriorityDialog> = {
    title: 'Features/Mutations/UpdatePriorityDialog',
    component: UpdatePriorityDialog,
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
type Story = StoryObj<typeof UpdatePriorityDialog>;

const UpdatePriorityWrapper = ({ currentPriority = 3, loading = false }: { currentPriority?: number; loading?: boolean }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="neutral" onClick={() => setOpen(true)}>
                Update Priority
            </Button>
            <UpdatePriorityDialog
                open={open}
                onOpenChange={setOpen}
                ruleId="8a7b6c5d4e3f2a1b"
                currentPriority={currentPriority}
                onConfirm={priority => {
                    alert(`Priority updated to ${priority}!`);
                    setOpen(false);
                }}
                loading={loading}
            />
        </>
    );
};

export const Default: Story = {
    render: () => <UpdatePriorityWrapper />,
};

export const HighPriority: Story = {
    render: () => <UpdatePriorityWrapper currentPriority={10} />,
};

export const ZeroPriority: Story = {
    render: () => <UpdatePriorityWrapper currentPriority={0} />,
};

export const Loading: Story = {
    render: () => <UpdatePriorityWrapper loading />,
};
