import React, { useRef, useState } from 'react';
import { ICellRendererParams, ValueFormatterParams, ValueGetterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { formatFileSize } from '@/component-library/features/utils/text-formatters';
import { RegularTable } from '@/component-library/features/table/RegularTable/RegularTable';
import { DIDTypeBadge } from '@/component-library/features/badges/DID/DIDTypeBadge';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { ListExtendedDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { RemovableCell } from '@/component-library/features/table/cells/selection-cells';

type StageDataTableProps = {
    rowData: ListExtendedDIDsViewModel[];
    removeDID: (item: ListExtendedDIDsViewModel) => void;
};

export const CreateRuleStageDataSelectedTable = (props: StageDataTableProps) => {
    const tableRef = useRef<AgGridReact<ListExtendedDIDsViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'Identifier',
            flex: 1,
            valueGetter: (params: ValueGetterParams<ListExtendedDIDsViewModel>) => `${params.data?.scope}:${params.data?.name}`,
            cellRenderer: (params: ICellRendererParams<ListExtendedDIDsViewModel>) => {
                const did = params.data!;
                return <RemovableCell onClick={() => props.removeDID(did)} {...params} />;
            },
            minWidth: 250,
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
            headerName: 'Size',
            field: 'bytes',
            valueFormatter: (params: ValueFormatterParams) => {
                return formatFileSize(params.value);
            },
            minWidth: 200,
            maxWidth: 200,
            sortable: false,
        },
    ]);

    return <RegularTable columnDefs={columnDefs} tableRef={tableRef} {...props} />;
};
