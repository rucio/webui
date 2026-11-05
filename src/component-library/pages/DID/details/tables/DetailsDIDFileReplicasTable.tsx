import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { FileReplicaStateViewModel } from '@/lib/infrastructure/data/view-model/did';
import { GridReadyEvent } from 'ag-grid-community';
import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { ReplicaStateBadge } from '@/component-library/features/badges/DID/ReplicaStateBadge';
import { ReplicaState } from '@/lib/core/entity/rucio';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { AgGridMultiSelectFilter, createMultiSelectFilterHandler } from '@/component-library/features/table/filters/AgGridMultiSelectFilter';
import { ClickableRSECell } from '@/component-library/features/table/cells/ClickableCellsCollection';
import { replicaStateString } from '@/lib/core/entity/state-to-string';

type DetailsDIDFileReplicasTableProps = {
    streamingHook: UseStreamReader<FileReplicaStateViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
    isActive?: boolean;
};

export const DetailsDIDFileReplicasTable = (props: DetailsDIDFileReplicasTableProps) => {
    const tableRef = useRef<AgGridReact<FileReplicaStateViewModel>>(null);

    const replicaStateOptions = Object.values(ReplicaState);
    const replicaStateValueFormatter = (value: ReplicaState) => replicaStateString[value];

    const [columnDefs] = useState([
        {
            headerName: 'RSE',
            field: 'rse',
            width: 300,
            cellRenderer: ClickableRSECell,
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
            filter: {
                component: AgGridMultiSelectFilter,
                handler: createMultiSelectFilterHandler(replicaStateOptions, replicaStateValueFormatter),
            },
            filterParams: {
                options: replicaStateOptions,
                valueFormatter: replicaStateValueFormatter,
            },
        },
    ]);

    return <StreamedTable columnDefs={columnDefs} tableRef={tableRef} {...props} enableFilterHandlers />;
};
