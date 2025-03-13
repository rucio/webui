import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { FileReplicaStateViewModel } from '@/lib/infrastructure/data/view-model/did';
import { GridReadyEvent } from 'ag-grid-community';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';
import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { buildDiscreteFilterParams, DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { ReplicaStateBadge } from '@/component-library/features/badges/DID/ReplicaStateBadge';
import { ReplicaState } from '@/lib/core/entity/rucio';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';

type DetailsDIDFileReplicasTableProps = {
    streamingHook: UseStreamReader<FileReplicaStateViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
};

const ClickableRSE = (props: { value: string }) => {
    return <ClickableCell href={`/rse/page/${props.value}`}>{props.value}</ClickableCell>;
};

export const DetailsDIDFileReplicasTable = (props: DetailsDIDFileReplicasTableProps) => {
    const tableRef = useRef<AgGridReact<FileReplicaStateViewModel>>(null!);

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
