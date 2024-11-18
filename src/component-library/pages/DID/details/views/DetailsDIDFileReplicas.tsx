import React, { useEffect } from 'react';
import { FileReplicaStateViewModel } from '@/lib/infrastructure/data/view-model/did';
import { DetailsDIDView, DetailsDIDProps } from '@/component-library/pages/DID/details/views/DetailsDIDView';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { DetailsDIDFileReplicasTable } from '@/component-library/pages/DID/details/tables/DetailsDIDFileReplicasTable';

export const DetailsDIDFileReplicas: DetailsDIDView = ({ scope, name }: DetailsDIDProps) => {
    const { gridApi, onGridReady, streamingHook, startStreaming, stopStreaming } = useTableStreaming<FileReplicaStateViewModel>();

    useEffect(() => {
        if (gridApi) {
            const url = '/api/feature/list-file-replicas?' + new URLSearchParams({ scope, name });
            startStreaming(url);
        }
    }, [gridApi]);

    return <DetailsDIDFileReplicasTable streamingHook={streamingHook} onGridReady={onGridReady} />;
};
