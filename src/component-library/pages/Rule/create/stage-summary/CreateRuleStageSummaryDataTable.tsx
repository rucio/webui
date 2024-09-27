import React, { useRef, useState } from 'react';
import { ValueFormatterParams, ValueGetterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { formatFileSize } from '@/component-library/features/utils/text-formatters';
import { RegularTable } from '@/component-library/features/table/RegularTable/RegularTable';
import { DIDTypeBadge } from '@/component-library/features/badges/DID/DIDTypeBadge';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { CheckboxCell, checkboxCellWrapperStyle } from '@/component-library/features/table/cells/CheckboxCell';

type StageSummaryDataTableProps = {
    rowData: ListDIDsViewModel[];
    copies: number;
};

export const CreateRuleStageSummaryDataTable = (props: StageSummaryDataTableProps) => {
    const tableRef = useRef<AgGridReact<ListDIDsViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'Identifier',
            valueGetter: (params: ValueGetterParams<ListDIDsViewModel>) => `${params.data?.scope}:${params.data?.name}`,
            minWidth: 250,
            flex: 1,
            sortable: false,
        },
        {
            headerName: 'Type',
            field: 'did_type',
            cellRenderer: DIDTypeBadge,
            minWidth: 180,
            maxWidth: 180,
            cellStyle: badgeCellWrapperStyle,
            cellRendererParams: {
                className: badgeCellClasses,
            },
            sortable: false,
        },
        {
            headerName: 'Copies',
            valueGetter: () => props.copies,
            minWidth: 100,
            maxWidth: 100,
            sortable: false,
        },
        {
            headerName: 'Files',
            field: 'length',
            minWidth: 100,
            maxWidth: 100,
            sortable: false,
        },
        {
            headerName: 'Size',
            field: 'bytes',
            valueFormatter: (params: ValueFormatterParams) => {
                return formatFileSize(params.value);
            },
            minWidth: 200,
            maxWidth: 200,
            sortable: false,
        },
        {
            headerName: 'Requested Size',
            valueGetter: (params: ValueGetterParams<ListDIDsViewModel>) => {
                if (params.data?.bytes) {
                    return formatFileSize(params.data?.bytes * props.copies);
                } else {
                    return formatFileSize(NaN);
                }
            },
            minWidth: 200,
            maxWidth: 200,
            sortable: false,
        },
        {
            headerName: 'Is Open',
            field: 'open',
            cellStyle: checkboxCellWrapperStyle,
            cellRenderer: CheckboxCell,
            minWidth: 100,
            maxWidth: 100,
            sortable: false,
        },
    ]);

    return <RegularTable columnDefs={columnDefs} tableRef={tableRef} {...props} />;
};
