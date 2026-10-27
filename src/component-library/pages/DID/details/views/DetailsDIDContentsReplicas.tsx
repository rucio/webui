import { DIDViewModel } from '@/lib/infrastructure/data/view-model/did';
import React, { useEffect, useState } from 'react';
import { DetailsDIDView, DetailsDIDProps } from '@/component-library/pages/DID/details/views/DetailsDIDView';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { DetailsDIDSimpleTable } from '@/component-library/pages/DID/details/tables/DetailsDIDSimpleTable';
import { SelectionChangedEvent } from 'ag-grid-community';
import { FileReplicasPFNPanel } from '@/component-library/pages/DID/details/views/FileReplicasPFNPanel';

export const DetailsDIDContentsReplicas: DetailsDIDView = ({ scope, name, isActive }: DetailsDIDProps) => {
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

    return (
        <div className="flex flex-col lg:flex-row grow gap-2">
            <div className="flex flex-col grow basis-0 min-w-0">
                <DetailsDIDSimpleTable
                    streamingHook={contentsStreamingHook}
                    onGridReady={onContentsGridReady}
                    onSelectionChanged={onSelectionChanged}
                    isActive={isActive}
                />
            </div>
            <div className="flex flex-col grow basis-0 min-w-0">
                <FileReplicasPFNPanel scope={selectedContent?.scope} name={selectedContent?.name} isActive={isActive} idPrefix="contents-replicas" />
            </div>
        </div>
    );
};
