'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFeature } from '@/component-library/features/feature-flags/FeatureProvider';
import { KeyValueRow } from '@/component-library/features/key-value/KeyValueRow';
import { parseAmiTags } from '@/lib/core/utils/ami-tag-utils';
import { QUERY_KEYS } from '@/lib/infrastructure/query/query-keys';
import { AMITagInfoViewModel } from '@/lib/infrastructure/data/view-model/ami';
import { AMITagChips } from './AMITagChips';

const ONE_HOUR_MS = 60 * 60 * 1000;

async function fetchAMITagInfo(tags: string[]): Promise<AMITagInfoViewModel> {
    const response = await fetch(`/api/feature/get-ami-tag-info?tags=${encodeURIComponent(tags.join(','))}`);
    if (!response.ok) {
        throw new Error(`AMI tag info request failed with HTTP ${response.status}`);
    }
    return response.json();
}

/**
 * "AMI Tags" key-value row for a DID (ATLAS only, flag dids.ami_tags).
 * Renders nothing when the flag is off or the DID name carries no AMI tags.
 */
export const AMITagsRow: React.FC<{ name: string }> = ({ name }) => {
    const enabled = useFeature('dids.ami_tags');
    const tags = React.useMemo(() => parseAmiTags(name), [name]);

    const { data, isLoading } = useQuery<AMITagInfoViewModel>({
        queryKey: [...QUERY_KEYS.AMI_TAG_INFO, tags.join(',')],
        queryFn: () => fetchAMITagInfo(tags),
        enabled: enabled && tags.length > 0,
        staleTime: ONE_HOUR_MS,
        // Keep unused entries as long as they stay fresh; the default 5 min gcTime
        // would otherwise refetch unchanged AMI/PanDA data after navigating away.
        gcTime: ONE_HOUR_MS,
        retry: false,
        refetchOnWindowFocus: false,
    });

    if (!enabled || tags.length === 0) return null;

    return (
        <KeyValueRow name="AMI Tags">
            <AMITagChips tags={tags} infos={data?.status === 'success' ? data.tags : undefined} isLoading={isLoading} />
        </KeyValueRow>
    );
};

AMITagsRow.displayName = 'AMITagsRow';
