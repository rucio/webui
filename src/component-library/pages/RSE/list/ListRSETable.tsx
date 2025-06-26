import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { RSEViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { CheckboxCell, checkboxCellWrapperStyle } from '@/component-library/features/table/cells/CheckboxCell';
import { DefaultTextFilterParams, DefaultBooleanFilterParams, buildDiscreteFilterParams } from '@/component-library/features/utils/filter-parameters';
import { GridReadyEvent } from 'ag-grid-community';
import { RSETypeBadge } from '@/component-library/features/badges/RSE/RSETypeBadge';
import { RSEType } from '@/lib/core/entity/rucio';

type ListRSETableProps = {
    streamingHook: UseStreamReader<RSEViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
};

const ClickableName = (props: { value: string }) => {
    return <ClickableCell href={`/rse/page/${props.value}`}>{props.value}</ClickableCell>;
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
            cellStyle: badgeCellWrapperStyle,
            cellRenderer: RSETypeBadge,
            cellRendererParams: {
                className: badgeCellClasses,
            },
            filter: true,
            sortable: false,
            filterParams: buildDiscreteFilterParams(Object.values(RSEType)),
        },
        {
            headerName: 'Volatile',
            field: 'volatile',
            flex: 1,
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
