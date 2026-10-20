import React, { useEffect, useRef, useState } from 'react';
import { DIDDatasetReplicasViewModel } from '@/lib/infrastructure/data/view-model/did';
import { DetailsDIDView, DetailsDIDProps } from '@/component-library/pages/DID/details/views/DetailsDIDView';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { AgGridReact } from 'ag-grid-react';
import {
    DefaultDateFilterParams,
    DefaultTextFilterParams,
    ProgressBarFilterParams,
    progressBarValueGetter,
} from '@/component-library/features/utils/filter-parameters';
import { ProgressBarCell, ProgressBarParams } from '@/component-library/features/table/cells/ProgressBarCell';
import { ReplicaState } from '@/lib/core/entity/rucio';
import { ReplicaStateBadge } from '@/component-library/features/badges/DID/ReplicaStateBadge';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { AgGridMultiSelectFilter, createMultiSelectFilterHandler } from '@/component-library/features/table/filters/AgGridMultiSelectFilter';
import { ClickableRSECell } from '@/component-library/features/table/cells/ClickableCellsCollection';
import { DateCellRenderer } from '@/component-library/features/utils/DateWithTooltip';
import { formatFileSize } from '@/component-library/features/utils/text-formatters';
import { ICellRendererParams, ValueGetterParams } from 'ag-grid-community';
import { textCellWrapperStyle } from '@/component-library/features/table/cells/text-cell';

const ReplicaStateDisplayNames = {
    [ReplicaState.AVAILABLE]: 'Available',
    [ReplicaState.UNAVAILABLE]: 'Unavailable',
    [ReplicaState.COPYING]: 'Copying',
    [ReplicaState.BEING_DELETED]: 'Being Deleted',
    [ReplicaState.BAD]: 'Bad',
    [ReplicaState.TEMPORARY_UNAVAILABLE]: 'Temporary Unavailable',
    [ReplicaState.UNKNOWN]: 'Unknown',
};

export const DetailsDIDDatasetReplicas: DetailsDIDView = ({ scope, name, isActive }: DetailsDIDProps) => {
    const { gridApi, onGridReady, streamingHook, startStreaming, stopStreaming } = useTableStreaming<DIDDatasetReplicasViewModel>();
    const gridRef = useRef<AgGridReact>(null);

    useEffect(() => {
        if (gridApi) {
            const url = '/api/feature/list-dataset-replicas?' + new URLSearchParams({ scope, name });
            startStreaming(url);
        }
    }, [gridApi]);

    const replicaStateOptions = Object.values(ReplicaState);
    const replicaStateValueFormatter = (value: ReplicaState) => ReplicaStateDisplayNames[value];

    const [columnDefs] = useState([
        {
            headerName: 'RSE',
            field: 'rse',
            flex: 3,
            minWidth: 250,
            pinned: 'left' as const,
            cellRenderer: ClickableRSECell,
            filter: true,
            filterParams: DefaultTextFilterParams,
            cellStyle: textCellWrapperStyle,
        },
        {
            headerName: 'State',
            field: 'state',
            flex: 1,
            minWidth: 200,
            cellStyle: {
                ...badgeCellWrapperStyle,
                alignItems: 'center',
            },
            cellRendererParams: {
                className: badgeCellClasses,
            },
            cellRenderer: ReplicaStateBadge,
            filter: {
                component: AgGridMultiSelectFilter,
                handler: createMultiSelectFilterHandler(replicaStateOptions, replicaStateValueFormatter),
            },
            filterParams: {
                options: replicaStateOptions,
                valueFormatter: replicaStateValueFormatter,
            },
        },
        {
            headerName: 'Replication Progress - Files',
            flex: 3,
            minWidth: 300,
            sortable: true,
            cellRenderer: ProgressBarCell,
            cellRendererParams: (params: ICellRendererParams<DIDDatasetReplicasViewModel>) =>
                ({
                    available: params.data?.available_length,
                    all: params.data?.length,
                    keyword: 'files',
                } as ProgressBarParams),
            cellStyle: {
                ...badgeCellWrapperStyle,
                alignItems: 'center',
            },
            filter: 'agNumberColumnFilter',
            filterParams: ProgressBarFilterParams,
            filterValueGetter: (params: ValueGetterParams<DIDDatasetReplicasViewModel>) =>
                progressBarValueGetter(params.data?.available_length, params.data?.length),
        },
        {
            headerName: 'Replication Progress - Bytes',
            flex: 3,
            minWidth: 300,
            sortable: false,
            cellRenderer: ProgressBarCell,
            cellRendererParams: (params: ICellRendererParams<DIDDatasetReplicasViewModel>) => ({
                    available: params.data ? params.data.available_bytes : 0,
                    all: params.data ? params.data.bytes : 0,
                    keyword: '',
                    valueFormatter: formatFileSize,
                } as ProgressBarParams),
            cellStyle: {
                ...badgeCellWrapperStyle,
                alignItems: 'center',
            },
            filter: 'agNumberColumnFilter',
            filterParams: ProgressBarFilterParams,
            filterValueGetter: (params: ValueGetterParams<DIDDatasetReplicasViewModel>) =>
                progressBarValueGetter(params.data?.available_bytes, params.data?.bytes),
        },
        {
            headerName: 'Created At',
            field: 'created_at',
            flex: 1,
            minWidth: 220,
            sortable: true,
            cellRenderer: DateCellRenderer,
            cellStyle: textCellWrapperStyle,
            filter: 'agDateColumnFilter',
            filterParams: DefaultDateFilterParams,
        },
        {
            headerName: 'Updated At',
            field: 'updated_at',
            flex: 1,
            minWidth: 220,
            sortable: true,
            cellRenderer: DateCellRenderer,
            cellStyle: textCellWrapperStyle,
            filter: 'agDateColumnFilter',
            filterParams: DefaultDateFilterParams,
        },
        {
            headerName: 'Last Accessed',
            field: 'accessed_at',
            flex: 1,
            minWidth: 220,
            sortable: true,
            cellRenderer: DateCellRenderer,
            cellStyle: textCellWrapperStyle,
            filter: 'agDateColumnFilter',
            filterParams: DefaultDateFilterParams,
        },
    ]);

    return (
        <StreamedTable
            columnDefs={columnDefs}
            tableRef={gridRef}
            onGridReady={onGridReady}
            streamingHook={streamingHook}
            rowHeight={75}
            isActive={isActive}
            enableFilterHandlers
        />
    );
};
