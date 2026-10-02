import React from 'react';
import { DIDType } from '@/lib/core/entity/rucio';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { LoadingSpinner } from '@/component-library/atoms/loading/LoadingSpinner';
import { NoLoadedRowsOverlay } from '@/component-library/features/table/overlays/NoLoadedRowsOverlay';
import { StreamingError, StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';

const PLURAL_LABELS: Partial<Record<DIDType, string>> = {
    [DIDType.CONTAINER]: 'containers',
    [DIDType.DATASET]: 'datasets',
    [DIDType.FILE]: 'files',
};

/**
 * Copy for the terminal states of an All search. Each pairs a headline with a
 * line telling the user what to do next, matching NoLoadedRowsOverlay's shape.
 */
export const NOTICE_COPY: Record<string, { primary: string; secondary: string }> = {
    'refine-wildcard': {
        primary: 'Please refine the DID name.',
        secondary: 'Wildcard searches on files are not supported. Narrow the name, or search the File type directly.',
    },
    'no-results': {
        primary: 'No DIDs matched this query.',
        secondary: 'Containers, datasets and files were all searched.',
    },
    'files-skipped': {
        primary: 'Files were not searched.',
        secondary: 'Wildcard searches on files are not supported. Search the File type directly to include them.',
    },
};

const joinTypes = (types: DIDType[]): string => {
    const labels = types.map(type => PLURAL_LABELS[type] ?? String(type).toLowerCase());
    if (labels.length <= 1) return labels.join('');
    return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`;
};

const progressLine = (record: ListDIDsViewModel): string | null => {
    if (record.kind !== 'progress' || !record.progress) return null;
    const types = joinTypes(record.progress.types);
    if (record.progress.state === 'searching') return `Searching ${types}...`;
    if (record.progress.state === 'empty') return `No ${types} matched.`;
    return `Found ${types}.`;
};

type DIDSearchOverlayProps = {
    records: ListDIDsViewModel[];
    status: StreamingStatus;
    error?: StreamingError;
};

/**
 * The table's empty state during and after an All search.
 *
 * The cascade reports which type it is looking at as it goes; that belongs where
 * the results will land, not as standing text elsewhere on the page. Showing only
 * the current step keeps it reading as activity rather than as a log that never
 * clears. Anything the cascade has no opinion on falls through to the standard
 * streaming overlay.
 */
export const DIDSearchOverlay = ({ records, status, error }: DIDSearchOverlayProps) => {
    if (error) {
        return <NoLoadedRowsOverlay error={error} status={status} />;
    }

    const notice = [...records].reverse().find(record => record.kind === 'notice');
    if (notice?.notice) {
        const copy = NOTICE_COPY[notice.notice.code];
        return (
            <div className="flex flex-col items-center gap-1 text-center px-4">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-100">{copy?.primary ?? notice.notice.message}</p>
                {copy?.secondary && <p className="text-xs text-neutral-500 dark:text-neutral-400">{copy.secondary}</p>}
            </div>
        );
    }

    if (status === StreamingStatus.RUNNING) {
        const line = [...records].reverse().map(progressLine).find(Boolean);
        return (
            <div className="flex flex-col items-center gap-2 text-center px-4">
                <LoadingSpinner />
                {line && <p className="text-sm text-neutral-700 dark:text-neutral-100">{line}</p>}
            </div>
        );
    }

    return <NoLoadedRowsOverlay error={error} status={status} />;
};
