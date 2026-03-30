import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { CommentRuleDialog } from './CommentRuleDialog';
import { Button } from '@/component-library/atoms/form/button';
import { Toaster } from '@/component-library/atoms/toast/Toaster';

const meta: Meta<typeof CommentRuleDialog> = {
    title: 'Features/Mutations/CommentRuleDialog',
    component: CommentRuleDialog,
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
type Story = StoryObj<typeof CommentRuleDialog>;

const LONG_COMMENT =
    'This rule was created as part of the Q4 data preservation campaign for the ATLAS detector collaboration. ' +
    'All datasets tagged for long-term archival must remain on at least two T1 RSEs for a minimum of 24 months per ' +
    'data management policy DMP-2024-07. Do not modify the lifetime or RSE expression without approval from the ' +
    'data preservation committee (atlas-dp-committee@cern.ch). Last reviewed: 2024-11-15.';

const CommentRuleWrapper = ({ loading = false, initialComment = '' }: { loading?: boolean; initialComment?: string }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)}>Add Comment</Button>
            <CommentRuleDialog
                open={open}
                onOpenChange={setOpen}
                ruleId="8a7b6c5d4e3f2a1b"
                onConfirm={comment => {
                    alert(`Comment added: ${comment}`);
                    setOpen(false);
                }}
                loading={loading}
                initialComment={initialComment}
            />
        </>
    );
};

export const Default: Story = {
    render: () => <CommentRuleWrapper />,
};

export const WithLongComment: Story = {
    render: () => <CommentRuleWrapper initialComment={LONG_COMMENT} />,
};

export const Loading: Story = {
    render: () => <CommentRuleWrapper loading />,
};
