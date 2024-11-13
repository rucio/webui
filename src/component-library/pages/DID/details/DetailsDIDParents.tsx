import { DIDViewModel } from '@/lib/infrastructure/data/view-model/did';
import React, { useEffect } from 'react';
import { DetailsDIDComponent, DetailsDIDProps } from '@/component-library/pages/DID/details/DetailsDIDComponent';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { DetailsDIDSimpleTable } from '@/component-library/pages/DID/details/DetailsDIDSimpleTable';

export const DetailsDIDParents: DetailsDIDComponent = ({ scope, name }: DetailsDIDProps) => {
    const { gridApi, onGridReady, streamingHook, startStreaming, stopStreaming } = useTableStreaming<DIDViewModel>();

    useEffect(() => {
        if (gridApi) {
            const url = '/api/feature/list-did-parents?' + new URLSearchParams({ scope, name });
            startStreaming(url);
        }
    }, [gridApi]);

    return <DetailsDIDSimpleTable streamingHook={streamingHook} onGridReady={onGridReady} />;
};
