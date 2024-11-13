import React, { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { buildDiscreteFilterParams, DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { GridReadyEvent } from 'ag-grid-community';
import { ReplicaState } from '@/lib/core/entity/rucio';
import { FileReplicaStateViewModel } from '@/lib/infrastructure/data/view-model/did';
import { ReplicaStateBadge } from '@/component-library/features/badges/DID/ReplicaStateBadge';
import { DetailsDIDView, DetailsDIDProps } from '@/component-library/pages/DID/details/views/DetailsDIDView';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';

type DetailsDIDFileReplicasTableProps = {
    streamingHook: UseStreamReader<FileReplicaStateViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
};

const ClickableRSE = (props: { value: string }) => {
    return <ClickableCell href={`/rse/page/${props.value}`}>{props.value}</ClickableCell>;
};

export const DetailsDIDFileReplicasTable = (props: DetailsDIDFileReplicasTableProps) => {
    const tableRef = useRef<AgGridReact<FileReplicaStateViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'RSE',
            field: 'rse',
            flex: 1,
            sortable: false,
            cellRenderer: ClickableRSE,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'State',
            field: 'state',
            flex: 1,
            cellStyle: badgeCellWrapperStyle,
            cellRenderer: ReplicaStateBadge,
            cellRendererParams: {
                className: badgeCellClasses,
            },
            filter: true,
            sortable: false,
            // TODO: fix the string values
            filterParams: buildDiscreteFilterParams(Object.values(ReplicaState)),
        },
    ]);

    return <StreamedTable columnDefs={columnDefs} tableRef={tableRef} {...props} />;
};

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
