import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FileReplicaStateViewModel } from '@/lib/infrastructure/data/view-model/did';
import { FileReplicasMetalinkViewModel } from '@/lib/infrastructure/data/view-model/replica';
import { ReplicaState } from '@/lib/core/entity/rucio';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { DetailsDIDFileReplicasTable } from '@/component-library/pages/DID/details/tables/DetailsDIDFileReplicasTable';
import {
    buildReplicaPFNQuery,
    DEFAULT_REPLICA_PFN_OPTIONS,
    ReplicaPFNOptions,
    ReplicaPFNOptionsValue,
} from '@/component-library/pages/DID/details/views/ReplicaPFNOptions';

const MISSING_STATES = Object.values(ReplicaState).filter(state => state !== ReplicaState.AVAILABLE);

export type FileReplicasPFNPanelProps = {
    /** File to list; nothing is streamed while undefined */
    scope?: string;
    name?: string;
    isActive?: boolean;
    /** Prefix for element ids of the options bar */
    idPrefix: string;
};

/**
 * Replicas of a file with their PFNs and the `rucio replica list file` options.
 */
export const FileReplicasPFNPanel = ({ scope, name, isActive, idPrefix }: FileReplicasPFNPanelProps) => {
    const { toast } = useToast();
    const { gridApi, onGridReady, streamingHook, startStreaming, stopStreaming } = useTableStreaming<FileReplicaStateViewModel>();
    const [options, setOptions] = useState<ReplicaPFNOptionsValue>(DEFAULT_REPLICA_PFN_OPTIONS);
    // URL waiting to be streamed; a running stream has to stop before startStreaming accepts a new one
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);
    const isRunning = streamingHook.status === StreamingStatus.RUNNING;

    useEffect(() => {
        if (scope && name) {
            setPendingUrl('/api/feature/list-file-replicas?' + buildReplicaPFNQuery(scope, name, options));
        }
    }, [scope, name, options]);

    useEffect(() => {
        if (!gridApi || !pendingUrl) return;
        if (isRunning) {
            stopStreaming();
            return;
        }
        // like `--missing`: keep the replicas that are not AVAILABLE
        gridApi.setColumnFilterModel('state', options.missingOnly ? MISSING_STATES : null).then(() => gridApi.onFilterChanged());
        startStreaming(pendingUrl);
        setPendingUrl(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gridApi, pendingUrl, isRunning]);

    const copyPFNs = async () => {
        const pfns: string[] = [];
        gridApi?.forEachNodeAfterFilterAndSort(node => {
            if (node.data?.pfn) pfns.push(node.data.pfn);
        });
        if (pfns.length === 0) {
            toast({ variant: 'info', title: 'No PFNs to copy', description: 'None of the listed replicas has a PFN.' });
            return;
        }
        try {
            await navigator.clipboard.writeText(pfns.join('\n'));
            toast({ variant: 'success', title: `Copied ${pfns.length} PFN${pfns.length === 1 ? '' : 's'}` });
        } catch {
            toast({ variant: 'error', title: 'Could not copy the PFNs', description: 'The browser denied access to the clipboard.' });
        }
    };

    const { mutate: downloadMetalink, isPending: isDownloading } = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/feature/get-file-replicas-metalink?' + buildReplicaPFNQuery(scope!, name!, options));
            const viewModel: FileReplicasMetalinkViewModel = await res.json();
            if (!res.ok || viewModel.status !== 'success') {
                throw viewModel;
            }
            return viewModel;
        },
        onSuccess: viewModel => {
            const url = URL.createObjectURL(new Blob([viewModel.xml], { type: 'application/metalink4+xml' }));
            const link = document.createElement('a');
            link.href = url;
            link.download = `${scope}_${name}.meta4`;
            link.click();
            URL.revokeObjectURL(url);
        },
        onError: (error: FileReplicasMetalinkViewModel | Error) => {
            toast({
                variant: 'error',
                title: 'Could not download the metalink',
                description: error.message || 'The Rucio server rejected the request.',
            });
        },
    });

    return (
        <div className="flex flex-col grow gap-2 min-h-0">
            <ReplicaPFNOptions
                idPrefix={idPrefix}
                value={options}
                onApply={setOptions}
                onCopyPFNs={copyPFNs}
                onDownloadMetalink={() => downloadMetalink()}
                isDownloading={isDownloading}
                disabled={!scope || !name}
            />
            <DetailsDIDFileReplicasTable streamingHook={streamingHook} onGridReady={onGridReady} isActive={isActive} />
        </div>
    );
};
