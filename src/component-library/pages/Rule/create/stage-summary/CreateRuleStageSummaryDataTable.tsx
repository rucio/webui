import React, { useRef, useState } from 'react';
import { ValueFormatterParams, ValueGetterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { formatFileSize } from '@/component-library/features/utils/text-formatters';
import { RegularTable } from '@/component-library/features/table/RegularTable/RegularTable';
import { DIDTypeBadge } from '@/component-library/features/badges/DID/DIDTypeBadge';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { CheckboxCell, checkboxCellWrapperStyle } from '@/component-library/features/table/cells/CheckboxCell';
import { buildDiscreteFilterParams, DefaultTextFilterParams, DefaultBooleanFilterParams } from '@/component-library/features/utils/filter-parameters';
import { DIDType } from '@/lib/core/entity/rucio';

type StageSummaryDataTableProps = {
    rowData: ListDIDsViewModel[];
    copies: number;
};

const DIDTypeDisplayNames = {
    [DIDType.FILE]: 'File',
    [DIDType.DATASET]: 'Dataset',
    [DIDType.CONTAINER]: 'Container',
    [DIDType.COLLECTION]: 'Collection',
    [DIDType.ALL]: 'All',
};

export const CreateRuleStageSummaryDataTable = (props: StageSummaryDataTableProps) => {
    const tableRef = useRef<AgGridReact<ListDIDsViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'Identifier',
            valueGetter: (params: ValueGetterParams<ListDIDsViewModel>) => `${params.data?.scope}:${params.data?.name}`,
            flex: 1,
            minWidth: 400,
            pinned: 'left' as const,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Type',
            field: 'did_type',
            cellRenderer: DIDTypeBadge,
            minWidth: 180,
            cellStyle: badgeCellWrapperStyle,
            cellRendererParams: {
                className: badgeCellClasses,
            },
            filter: true,
            filterParams: buildDiscreteFilterParams(Object.values(DIDTypeDisplayNames), Object.values(DIDType)),
        },
        {
            headerName: 'Copies',
            valueGetter: () => props.copies,
            minWidth: 100,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'Files',
            field: 'length',
            minWidth: 100,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'Size',
            field: 'bytes',
            valueFormatter: (params: ValueFormatterParams) => {
                return formatFileSize(params.value);
            },
            minWidth: 200,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'Requested Size',
            valueGetter: (params: ValueGetterParams<ListDIDsViewModel>) => {
                if (params.data?.bytes) {
                    return params.data?.bytes * props.copies;
                } else {
                    return NaN;
                }
            },
            valueFormatter: (params: ValueFormatterParams) => {
                return formatFileSize(params.value);
            },
            minWidth: 200,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'Is Open',
            field: 'open',
            cellStyle: checkboxCellWrapperStyle,
            cellRenderer: CheckboxCell,
            minWidth: 100,
            filter: true,
            filterParams: DefaultBooleanFilterParams,
        },
    ]);

    return <RegularTable columnDefs={columnDefs} tableRef={tableRef} {...props} />;
};
