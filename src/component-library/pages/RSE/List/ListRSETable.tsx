import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { UseChunkedStream } from '@/lib/infrastructure/hooks/useChunkedStream';
import { RSEViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';
import { BadgeCell, badgeCellWrapperStyle } from '@/component-library/features/table/cells/BadgeCell';
import { CheckboxCell, checkboxCellWrapperStyle } from '@/component-library/features/table/cells/CheckboxCell';
import { DefaultTextFilterParams } from '@/component-library/features/table/filter-parameters/DefaultTextFilterParams';
import { DefaultBooleanFilterParams } from '@/component-library/features/table/filter-parameters/DefaultBooleanFilterParams';
import { buildDiscreteFilterParams } from '@/component-library/features/table/filter-parameters/buildDiscreteFilterParams';
import { GridReadyEvent } from 'ag-grid-community';

type ListRSETableProps = {
    streamingHook: UseChunkedStream<RSEViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
};

const ClickableName = (props: { value: string }) => {
    return <ClickableCell href={`/rse/page/${props.value}`}>{props.value}</ClickableCell>;
};

const typeColorClasses: Record<string, string> = {
    DISK: 'bg-base-info-500',
    TAPE: 'bg-extra-rose-500',
    UNKNOWN: 'bg-base-warning-400',
};

const TypeBadge = (props: { value: string }) => {
    return <BadgeCell value={props.value} colorClass={typeColorClasses[props.value]} />;
};

export const ListRSETable = (props: ListRSETableProps) => {
    const tableRef = useRef<AgGridReact<RSEViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'Name',
            field: 'name',
            flex: 4,
            minWidth: 250,
            cellRenderer: ClickableName,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Type',
            field: 'rse_type',
            flex: 1,
            minWidth: 125,
            maxWidth: 200,
            cellStyle: badgeCellWrapperStyle,
            cellRenderer: TypeBadge,
            filter: true,
            sortable: false,
            filterParams: buildDiscreteFilterParams(['DISK', 'TAPE', 'UNKNOWN']),
        },
        {
            headerName: 'Volatile',
            field: 'volatile',
            flex: 1,
            maxWidth: 175,
            minWidth: 125,
            cellStyle: checkboxCellWrapperStyle,
            cellRenderer: CheckboxCell,
            sortable: false,
            filter: true,
            filterParams: DefaultBooleanFilterParams,
        },
        {
            headerName: 'Deterministic',
            field: 'deterministic',
            flex: 1,
            maxWidth: 200,
            minWidth: 175,
            cellStyle: checkboxCellWrapperStyle,
            cellRenderer: CheckboxCell,
            sortable: false,
            filter: true,
            filterParams: DefaultBooleanFilterParams,
        },
        {
            headerName: 'Staging',
            field: 'staging_area',
            flex: 1,
            maxWidth: 175,
            minWidth: 125,
            cellStyle: checkboxCellWrapperStyle,
            cellRenderer: CheckboxCell,
            sortable: false,
            filter: true,
            filterParams: DefaultBooleanFilterParams,
        },
    ]);

    return <StreamedTable columnDefs={columnDefs} tableRef={tableRef} {...props} />;
};
