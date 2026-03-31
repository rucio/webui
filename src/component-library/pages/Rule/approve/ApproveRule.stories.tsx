'use client';

import { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { fixtureRuleViewModel } from '@/test/fixtures/table-fixtures';
import { ApproveRule, ApproveRuleProps } from '@/component-library/pages/Rule/approve/ApproveRule';
import { ToastedTemplate } from '@/component-library/templates/ToastedTemplate/ToastedTemplate';
import { getDecoratorWithWorker } from '@/test/mocks/handlers/story-decorators';
import { getMockStreamEndpoint } from '@/test/mocks/handlers/streaming-handlers';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { RuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { RuleState } from '@/lib/core/entity/rucio';

// ── Story wrapper ─────────────────────────────────────────────────────────────
// ApproveRule receives a streamingHook from its parent (the client component),
// so we wrap it here to provide that hook and optional initial/auto-load data.

type StoryWrapperProps = Omit<ApproveRuleProps, 'streamingHook' | 'onGridReady'> & {
    initialData?: RuleViewModel[];
    autoSearch?: boolean;
};

const WAITING_URL = `/api/feature/list-rules?${new URLSearchParams({ state: RuleState.WAITING_APPROVAL }).toString()}`;

const ApproveRuleStoryWrapper = ({ initialData, autoSearch, ...approveRuleProps }: StoryWrapperProps) => {
    const { onGridReady, streamingHook, startStreaming, gridApi } = useTableStreaming<RuleViewModel>(initialData);
    const hasAutoLoaded = useRef(false);

    useEffect(() => {
        if (!hasAutoLoaded.current && autoSearch && gridApi) {
            hasAutoLoaded.current = true;
            startStreaming(WAITING_URL);
        }
    }, [gridApi]);

    return (
        <ApproveRule
            streamingHook={streamingHook}
            onGridReady={onGridReady}
            {...approveRuleProps}
        />
    );
};

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
    title: 'Components/Pages/Rule/Approve',
    component: ApproveRuleStoryWrapper,
    decorators: [
        Story => (
            <ToastedTemplate>
                <Story />
            </ToastedTemplate>
        ),
    ],
    parameters: {
        docs: { disable: true },
    },
    args: {
        onApprove: fn(),
        onDeny: fn(),
        approvingRuleId: null,
        denyingRuleId: null,
    },
} satisfies Meta<typeof ApproveRuleStoryWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ───────────────────────────────────────────────────────────────────

/**
 * Default story: several rules in WAITING_APPROVAL state pre-loaded into the
 * grid as initial data (no MSW endpoint needed).
 */
export const Default: Story = {
    args: {
        initialData: Array.from({ length: 12 }, () => ({
            ...fixtureRuleViewModel(),
            state: RuleState.WAITING_APPROVAL,
        })),
    },
};

/**
 * Empty story: the grid has been initialised but no rules are waiting for
 * approval.  Shows the empty-state overlay.
 */
export const Empty: Story = {
    args: {
        initialData: [],
    },
};

/**
 * Loading story: streaming is in progress.  The table shows its loading
 * overlay while data is being fetched from the server.  Uses an MSW handler
 * that intentionally takes a long time so the loading state remains visible.
 */
export const Loading: Story = {
    args: {
        autoSearch: true,
    },
    decorators: [
        getDecoratorWithWorker([
            getMockStreamEndpoint('/api/feature/list-rules', {
                // Large delay per record keeps the RUNNING overlay on screen
                data: Array.from({ length: 500 }, () => ({
                    ...fixtureRuleViewModel(),
                    state: RuleState.WAITING_APPROVAL,
                })),
                delay: 100,
            }),
        ]),
    ],
};

/**
 * RegularStreaming story: full streaming simulation via MSW – rules arrive
 * quickly, mirroring the production experience.
 */
export const RegularStreaming: Story = {
    args: {
        autoSearch: true,
    },
    decorators: [
        getDecoratorWithWorker([
            getMockStreamEndpoint('/api/feature/list-rules', {
                data: Array.from({ length: 500 }, () => ({
                    ...fixtureRuleViewModel(),
                    state: RuleState.WAITING_APPROVAL,
                })),
                delay: 1,
            }),
        ]),
    ],
};
