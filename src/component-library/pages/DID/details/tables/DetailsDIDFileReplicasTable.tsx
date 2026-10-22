import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { FileReplicaStateViewModel } from '@/lib/infrastructure/data/view-model/did';
import { GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { ReplicaStateBadge } from '@/component-library/features/badges/DID/ReplicaStateBadge';
import { ReplicaState } from '@/lib/core/entity/rucio';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { AgGridMultiSelectFilter, createMultiSelectFilterHandler } from '@/component-library/features/table/filters/AgGridMultiSelectFilter';
import { ClickableRSECell } from '@/component-library/features/table/cells/ClickableCellsCollection';
import { CopyableCell } from '@/component-library/features/table/cells/CopyableCell';

type DetailsDIDFileReplicasTableProps = {
    streamingHook: UseStreamReader<FileReplicaStateViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
    isActive?: boolean;
};

const ReplicaStateDisplayNames = {
    [ReplicaState.AVAILABLE]: 'Available',
    [ReplicaState.UNAVAILABLE]: 'Unavailable',
    [ReplicaState.COPYING]: 'Copying',
    [ReplicaState.BEING_DELETED]: 'Being Deleted',
    [ReplicaState.BAD]: 'Bad',
    [ReplicaState.TEMPORARY_UNAVAILABLE]: 'Temporary Unavailable',
    [ReplicaState.UNKNOWN]: 'Unknown',
};

const PFN_DOMAINS = ['lan', 'wan', 'zip'];

export const PFNCell = (props: ICellRendererParams<FileReplicaStateViewModel, string | null>) => {
    if (!props.value) {
        // Rucio could not build a PFN: no readable protocol on the RSE, or none matching the selected protocols
        return <span className="text-neutral-500 dark:text-neutral-400 italic">No PFN</span>;
    }
    return (
        <CopyableCell text={props.value} className="min-w-0">
            <span className="font-mono truncate" title={props.value}>
                {props.value}
            </span>
        </CopyableCell>
    );
};

export const DetailsDIDFileReplicasTable = (props: DetailsDIDFileReplicasTableProps) => {
    const tableRef = useRef<AgGridReact<FileReplicaStateViewModel>>(null);

    const replicaStateOptions = Object.values(ReplicaState);
    const replicaStateValueFormatter = (value: ReplicaState) => ReplicaStateDisplayNames[value];

    const [columnDefs] = useState([
        {
            headerName: 'RSE',
            field: 'rse',
            minWidth: 180,
            flex: 1,
            cellRenderer: ClickableRSECell,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'State',
            field: 'state',
            minWidth: 170,
            flex: 1,
            cellStyle: badgeCellWrapperStyle,
            cellRenderer: ReplicaStateBadge,
            cellRendererParams: {
                className: badgeCellClasses,
            },
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
            headerName: 'Protocol',
            field: 'protocol',
            width: 120,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Domain',
            field: 'domain',
            width: 120,
            filter: {
                component: AgGridMultiSelectFilter,
                handler: createMultiSelectFilterHandler(PFN_DOMAINS),
            },
            filterParams: {
                options: PFN_DOMAINS,
            },
        },
        {
            headerName: 'PFN',
            field: 'pfn',
            flex: 3,
            minWidth: 300,
            cellRenderer: PFNCell,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
    ]);

    return <StreamedTable columnDefs={columnDefs} tableRef={tableRef} {...props} enableFilterHandlers />;
};
