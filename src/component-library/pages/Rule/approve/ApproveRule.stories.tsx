'use client';

import { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { fixtureApproveRuleViewModel } from '@/test/fixtures/table-fixtures';
import { ApproveRule, ApproveRuleProps } from '@/component-library/pages/Rule/approve/ApproveRule';
import { ToastedTemplate } from '@/component-library/templates/ToastedTemplate/ToastedTemplate';
import { getDecoratorWithWorker } from '@/test/mocks/handlers/story-decorators';
import { getMockStreamEndpoint } from '@/test/mocks/handlers/streaming-handlers';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { ApproveRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { RuleState } from '@/lib/core/entity/rucio';

// ── Story wrapper ─────────────────────────────────────────────────────────────
// ApproveRule receives a streamingHook from its parent (the client component),
// so we wrap it here to provide that hook and optional initial/auto-load data.

type StoryWrapperProps = Omit<ApproveRuleProps, 'streamingHook' | 'onGridReady'> & {
    initialData?: ApproveRuleViewModel[];
    autoSearch?: boolean;
};

const WAITING_URL = `/api/feature/list-rules-pending-approval`;

const ApproveRuleStoryWrapper = ({ initialData, autoSearch, ...approveRuleProps }: StoryWrapperProps) => {
    const { onGridReady, streamingHook, startStreaming, stopStreaming, gridApi } = useTableStreaming<ApproveRuleViewModel>(initialData);
    const hasAutoLoaded = useRef(false);

    useEffect(() => {
        if (!hasAutoLoaded.current && autoSearch && gridApi) {
            hasAutoLoaded.current = true;
            startStreaming(WAITING_URL);
        }
    }, [gridApi]);

    const handleSearch = () => {
        startStreaming(WAITING_URL);
    };

    return (
        <ApproveRule streamingHook={streamingHook} onGridReady={onGridReady} onSearch={handleSearch} onStop={stopStreaming} {...approveRuleProps} />
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
            ...fixtureApproveRuleViewModel(),
            state: RuleState.WAITING_APPROVAL,
        })),
    },
};

/**
 * Multi-select filter test (for #789): 12 rules in WAITING_APPROVAL state,
 * split across three accounts (5 + 4 + 3). Every other field stays faker-random
 * so the grid looks realistic, but the Account column has only three distinct,
 * repeated values so you can filter to an exact, countable subset.
 *
 * How to verify the "Select All scopes to filtered rows" fix:
 *   1. Open the Account column filter and type "prod-transfers" so only those 5
 *      rows remain visible.
 *   2. Click the header checkbox (top-left of the grid).
 *   3. The bulk toolbar should read "5 rules selected", not 12. Before the fix
 *      the header checkbox selected every row in the dataset, including the
 *      filtered-out ones.
 *   4. Clear the filter: the 7 previously-hidden rows reappear unselected,
 *      confirming Approve/Deny would only target the visible subset.
 */
export const MultiSelectFilterTest: Story = {
    args: {
        initialData: [
            ...Array.from({ length: 5 }, () => 'prod-transfers'),
            ...Array.from({ length: 4 }, () => 'analysis-ops'),
            ...Array.from({ length: 3 }, () => 'data-mgmt'),
        ].map(account => ({
            ...fixtureApproveRuleViewModel(),
            account,
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
            getMockStreamEndpoint('/api/feature/list-rules-pending-approval', {
                // Large delay per record keeps the RUNNING overlay on screen
                data: Array.from({ length: 500 }, () => ({
                    ...fixtureApproveRuleViewModel(),
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
            getMockStreamEndpoint('/api/feature/list-rules-pending-approval', {
                data: Array.from({ length: 500 }, () => ({
                    ...fixtureApproveRuleViewModel(),
                    state: RuleState.WAITING_APPROVAL,
                })),
                delay: 1,
            }),
        ]),
    ],
};
