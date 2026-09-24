'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFeature } from '@/component-library/features/feature-flags/FeatureProvider';
import { KeyValueRow } from '@/component-library/features/key-value/KeyValueRow';
import { getAtlasPandaTaskId } from '@/lib/core/utils/atlas-did-name';
import { QUERY_KEYS } from '@/lib/infrastructure/query/query-keys';
import { PandaTaskLinkViewModel } from '@/lib/infrastructure/data/view-model/panda';
import { PandaTaskChip } from './PandaTaskChip';

const ONE_HOUR_MS = 60 * 60 * 1000;

async function fetchPandaTaskLink(taskId: string): Promise<PandaTaskLinkViewModel> {
    const response = await fetch(`/api/feature/get-panda-task-link?taskId=${encodeURIComponent(taskId)}`);
    if (!response.ok) {
        throw new Error(`PanDA task link request failed with HTTP ${response.status}`);
    }
    return response.json();
}

/**
 * "PanDA Task" key-value row for a DID (ATLAS only, flag dids.panda_task).
 * Renders nothing when the flag is off or the DID name carries no PanDA task.
 */
export const PandaTaskRow: React.FC<{ name: string }> = ({ name }) => {
    const enabled = useFeature('dids.panda_task');
    const taskId = React.useMemo(() => getAtlasPandaTaskId(name), [name]);

    const { data, isLoading } = useQuery<PandaTaskLinkViewModel>({
        queryKey: [...QUERY_KEYS.PANDA_TASK_LINK, taskId ?? ''],
        queryFn: () => fetchPandaTaskLink(taskId as string),
        enabled: enabled && taskId !== undefined,
        staleTime: ONE_HOUR_MS,
        // Keep unused entries as long as they stay fresh; the default 5 min gcTime
        // would otherwise refetch unchanged AMI/PanDA data after navigating away.
        gcTime: ONE_HOUR_MS,
        retry: false,
        refetchOnWindowFocus: false,
    });

    if (!enabled || taskId === undefined) return null;

    return (
        <KeyValueRow name="PanDA Task">
            <PandaTaskChip taskId={taskId} url={data?.status === 'success' ? data.url : undefined} isLoading={isLoading} />
        </KeyValueRow>
    );
};

PandaTaskRow.displayName = 'PandaTaskRow';
