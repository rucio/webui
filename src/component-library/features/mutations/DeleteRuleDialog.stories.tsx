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

const DeleteRuleWrapper = ({ isAdmin = false, loading = false }: { isAdmin?: boolean; loading?: boolean }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="error" onClick={() => setOpen(true)}>Delete Rule</Button>
            <DeleteRuleDialog
                open={open}
                onOpenChange={setOpen}
                ruleId="8a7b6c5d4e3f2a1b"
                isAdmin={isAdmin}
                onConfirm={() => {
                    alert('Rule deleted!');
                    setOpen(false);
                }}
                loading={loading}
            />
        </>
    );
};

export const AsUser: Story = {
    render: () => <DeleteRuleWrapper />,
};

export const AsAdmin: Story = {
    render: () => <DeleteRuleWrapper isAdmin />,
};

export const Loading: Story = {
    render: () => <DeleteRuleWrapper loading />,
};
