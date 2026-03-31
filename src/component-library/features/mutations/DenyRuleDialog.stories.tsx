import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { DenyRuleDialog } from './DenyRuleDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const meta: Meta<typeof DenyRuleDialog> = {
    title: 'Features/Mutations/DenyRuleDialog',
    component: DenyRuleDialog,
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
type Story = StoryObj<typeof DenyRuleDialog>;

const DenyRuleWrapper = ({ loading = false }: { loading?: boolean }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="error" onClick={() => setOpen(true)}>Deny Rule</Button>
            <DenyRuleDialog
                open={open}
                onOpenChange={setOpen}
                ruleId="8a7b6c5d4e3f2a1b"
                onConfirm={(comment) => {
                    alert(`Rule denied!${comment ? ` Comment: ${comment}` : ''}`);
                    setOpen(false);
                }}
                loading={loading}
            />
        </>
    );
};

export const Default: Story = {
    render: () => <DenyRuleWrapper />,
};

export const Loading: Story = {
    render: () => <DenyRuleWrapper loading />,
};
