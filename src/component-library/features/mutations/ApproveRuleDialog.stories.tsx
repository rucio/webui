import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { ApproveRuleDialog } from './ApproveRuleDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const meta: Meta<typeof ApproveRuleDialog> = {
    title: 'Features/Mutations/ApproveRuleDialog',
    component: ApproveRuleDialog,
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
type Story = StoryObj<typeof ApproveRuleDialog>;

const ApproveRuleWrapper = ({ loading = false }: { loading?: boolean }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)}>Approve Rule</Button>
            <ApproveRuleDialog
                open={open}
                onOpenChange={setOpen}
                ruleId="8a7b6c5d4e3f2a1b"
                onConfirm={() => {
                    alert('Rule approved!');
                    setOpen(false);
                }}
                loading={loading}
            />
        </>
    );
};

export const Default: Story = {
    render: () => <ApproveRuleWrapper />,
};

export const Loading: Story = {
    render: () => <ApproveRuleWrapper loading />,
};
