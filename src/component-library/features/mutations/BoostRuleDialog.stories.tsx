import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { BoostRuleDialog } from './BoostRuleDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const meta: Meta<typeof BoostRuleDialog> = {
    title: 'Features/Mutations/BoostRuleDialog',
    component: BoostRuleDialog,
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
type Story = StoryObj<typeof BoostRuleDialog>;

const BoostRuleWrapper = ({ currentLifetime, loading = false }: { currentLifetime?: number; loading?: boolean }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)}>Boost Rule</Button>
            <BoostRuleDialog
                open={open}
                onOpenChange={setOpen}
                ruleId="8a7b6c5d4e3f2a1b"
                currentLifetime={currentLifetime}
                onConfirm={days => {
                    alert(`Rule boosted by ${days} days!`);
                    setOpen(false);
                }}
                loading={loading}
            />
        </>
    );
};

export const Default: Story = {
    render: () => <BoostRuleWrapper currentLifetime={30} />,
};

export const NoCurrentLifetime: Story = {
    render: () => <BoostRuleWrapper />,
};

export const Loading: Story = {
    render: () => <BoostRuleWrapper currentLifetime={30} loading />,
};

export const HighLifetime: Story = {
    render: () => <BoostRuleWrapper currentLifetime={365} />,
};
