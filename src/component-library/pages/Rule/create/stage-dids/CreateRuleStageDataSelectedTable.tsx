import React, { useRef, useState } from 'react';
import { ICellRendererParams, ValueFormatterParams, ValueGetterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { formatFileSize } from '@/component-library/features/utils/text-formatters';
import { RegularTable } from '@/component-library/features/table/RegularTable/RegularTable';
import { DIDTypeBadge } from '@/component-library/features/badges/DID/DIDTypeBadge';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { RemovableCell } from '@/component-library/features/table/cells/selection-cells';
import { buildDiscreteFilterParams } from '@/component-library/features/utils/filter-parameters';
import { DIDType } from '@/lib/core/entity/rucio';

type StageDataTableProps = {
    rowData: ListDIDsViewModel[];
    removeDID: (item: ListDIDsViewModel) => void;
};

const DIDTypeDisplayNames = {
    [DIDType.FILE]: 'File',
    [DIDType.DATASET]: 'Dataset',
    [DIDType.CONTAINER]: 'Container',
    [DIDType.COLLECTION]: 'Collection',
    [DIDType.ALL]: 'All',
};

export const CreateRuleStageDataSelectedTable = (props: StageDataTableProps) => {
    const tableRef = useRef<AgGridReact<ListDIDsViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'Identifier',
            flex: 1,
            valueGetter: (params: ValueGetterParams<ListDIDsViewModel>) => `${params.data?.scope}:${params.data?.name}`,
            cellRenderer: (params: ICellRendererParams<ListDIDsViewModel>) => {
                const did = params.data!;
                return <RemovableCell onClick={() => props.removeDID(did)} {...params} />;
            },
            minWidth: 400,
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
            headerName: 'Size',
            field: 'bytes',
            valueFormatter: (params: ValueFormatterParams) => {
                return formatFileSize(params.value);
            },
            minWidth: 200,
            filter: 'agNumberColumnFilter',
        },
    ]);

    return <RegularTable columnDefs={columnDefs} tableRef={tableRef} {...props} />;
};
