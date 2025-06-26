import { DIDViewModel, FileReplicaStateViewModel } from '@/lib/infrastructure/data/view-model/did';
import React, { useEffect, useState } from 'react';
import { DetailsDIDView, DetailsDIDProps } from '@/component-library/pages/DID/details/views/DetailsDIDView';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { DetailsDIDSimpleTable } from '@/component-library/pages/DID/details/tables/DetailsDIDSimpleTable';
import { SelectionChangedEvent } from 'ag-grid-community';
import { DetailsDIDFileReplicasTable } from '@/component-library/pages/DID/details/tables/DetailsDIDFileReplicasTable';

export const DetailsDIDContentsReplicas: DetailsDIDView = ({ scope, name }: DetailsDIDProps) => {
    const {
        gridApi: contentsGridApi,
        onGridReady: onContentsGridReady,
        streamingHook: contentsStreamingHook,
        startStreaming: startContentsStreaming,
    } = useTableStreaming<DIDViewModel>();

    useEffect(() => {
        if (contentsGridApi) {
            const url = '/api/feature/list-did-contents?' + new URLSearchParams({ scope, name });
            startContentsStreaming(url);
        }
    }, [contentsGridApi]);

    const [selectedContent, setSelectedContent] = useState<DIDViewModel | null>(null);

    const onSelectionChanged = (event: SelectionChangedEvent) => {
        const selectedRows = event.api.getSelectedRows();
        if (selectedRows.length === 1) {
            setSelectedContent(selectedRows[0] as DIDViewModel);
        } else {
            setSelectedContent(null);
        }
    };

    const {
        onGridReady: onReplicasGridReady,
        streamingHook: replicasStreamingHook,
        startStreaming: startReplicasStreaming,
    } = useTableStreaming<FileReplicaStateViewModel>();

    // TODO: handle continuing streaming

    useEffect(() => {
        if (selectedContent) {
            const url =
                '/api/feature/list-file-replicas?' +
                new URLSearchParams({
                    scope: selectedContent.scope,
                    name: selectedContent.name,
                });
            startReplicasStreaming(url);
        }
    }, [selectedContent]);

    return (
        <div className="flex flex-col lg:flex-row grow gap-2">
            <div className="flex flex-col grow">
                <DetailsDIDSimpleTable
                    streamingHook={contentsStreamingHook}
                    onGridReady={onContentsGridReady}
                    onSelectionChanged={onSelectionChanged}
                />
            </div>
            <div className="flex flex-col grow">
                <DetailsDIDFileReplicasTable streamingHook={replicasStreamingHook} onGridReady={onReplicasGridReady} />
            </div>
        </div>
    );
};
