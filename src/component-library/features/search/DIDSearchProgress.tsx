import React from 'react';
import { DIDType } from '@/lib/core/entity/rucio';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';

const PLURAL_LABELS: Partial<Record<DIDType, string>> = {
    [DIDType.CONTAINER]: 'containers',
    [DIDType.DATASET]: 'datasets',
    [DIDType.FILE]: 'files',
};

const NOTICE_COPY: Record<string, string> = {
    'refine-wildcard': 'Please refine the DID name. Wildcard searches on files are not supported.',
    'no-results': 'No DIDs matched this query.',
};

const joinTypes = (types: DIDType[]): string => {
    const labels = types.map(type => PLURAL_LABELS[type] ?? String(type).toLowerCase());
    if (labels.length <= 1) return labels.join('');
    return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`;
};

const lineFor = (record: ListDIDsViewModel): string | null => {
    if (record.kind === 'notice' && record.notice) {
        return NOTICE_COPY[record.notice.code] ?? record.notice.message;
    }
    if (record.kind === 'progress' && record.progress) {
        const types = joinTypes(record.progress.types);
        if (record.progress.state === 'searching') return `Searching ${types}...`;
        if (record.progress.state === 'empty') return `No ${types} matched.`;
        return `Found ${types}.`;
    }
    return null;
};

/**
 * The trail of what an All search tried, in order. It stays beside the results
 * rather than being replaced by them, because "no containers, no datasets,
 * showing files" is what explains a file-only result set.
 */
export const DIDSearchProgress = ({ records }: { records: ListDIDsViewModel[] }) => {
    const lines = records.map(lineFor).filter((line): line is string => line !== null);

    if (lines.length === 0) return null;

    return (
        <ol role="status" aria-live="polite" className="mt-4 space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
            {lines.map((line, index) => (
                <li key={index}>{line}</li>
            ))}
        </ol>
    );
};
