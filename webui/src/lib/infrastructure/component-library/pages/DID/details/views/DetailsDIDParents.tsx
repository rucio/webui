import { DIDViewModel } from '@/lib/core/view-model/did';
import React, { useEffect } from 'react';
import { DetailsDIDView, DetailsDIDProps } from '@/component-library/pages/DID/details/views/DetailsDIDView';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { DetailsDIDSimpleTable } from '@/component-library/pages/DID/details/tables/DetailsDIDSimpleTable';

export const DetailsDIDParents: DetailsDIDView = ({ scope, name }: DetailsDIDProps) => {
    const { gridApi, onGridReady, streamingHook, startStreaming, stopStreaming } = useTableStreaming<DIDViewModel>();

    useEffect(() => {
        if (gridApi) {
            const url = '/api/feature/list-did-parents?' + new URLSearchParams({ scope, name });
            startStreaming(url);
        }
    }, [gridApi]);

    return <DetailsDIDSimpleTable streamingHook={streamingHook} onGridReady={onGridReady} />;
};
