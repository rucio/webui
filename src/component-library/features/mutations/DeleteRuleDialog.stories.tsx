import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { DeleteRuleDialog } from './DeleteRuleDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const meta: Meta<typeof DeleteRuleDialog> = {
    title: 'Features/Mutations/DeleteRuleDialog',
    component: DeleteRuleDialog,
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
type Story = StoryObj<typeof DeleteRuleDialog>;

const DeleteRuleWrapper = ({ loading = false }: { loading?: boolean }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="error" onClick={() => setOpen(true)}>
                Delete Rule
            </Button>
            <DeleteRuleDialog
                open={open}
                onOpenChange={setOpen}
                ruleId="8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d"
                onConfirm={() => {
                    alert('Rule deleted!');
                    setOpen(false);
                }}
                loading={loading}
            />
        </>
    );
};

export const Default: Story = {
    render: () => <DeleteRuleWrapper />,
};

export const Loading: Story = {
    render: () => <DeleteRuleWrapper loading />,
};

export const LongRuleId: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button variant="error" onClick={() => setOpen(true)}>
                    Delete Rule (Long ID)
                </Button>
                <DeleteRuleDialog
                    open={open}
                    onOpenChange={setOpen}
                    ruleId="8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d8a7b6c5d4e3f2a1b"
                    onConfirm={() => setOpen(false)}
                />
            </>
        );
    },
};
