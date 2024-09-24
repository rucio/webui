import React, { useRef, useState } from 'react';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { DIDLongViewModel } from '@/lib/infrastructure/data/view-model/did';
import { ICellRendererParams, ValueFormatterParams, ValueGetterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { formatFileSize } from '@/component-library/features/utils/text-formatters';
import { Button } from '@/component-library/atoms/form/button';
import { HiMinus } from 'react-icons/hi';
import { RegularTable } from '@/component-library/features/table/RegularTable/RegularTable';
import { DIDTypeBadge } from '@/component-library/features/badges/DID/DIDTypeBadge';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';

const CreateRuleRemovableCell = (props: { onClick: () => void; value: string }) => {
    return (
        <div className="flex flex-row items-center" onClick={props.onClick}>
            <Button variant="error" size="icon" className="mr-3 flex-shrink-0">
                <HiMinus />
            </Button>
            <span>{props.value}</span>
        </div>
    );
};

type StageDataTableProps = {
    rowData: ListDIDsViewModel[];
    removeDID: (item: ListDIDsViewModel) => void;
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
                return <CreateRuleRemovableCell onClick={() => props.removeDID(did)} {...params} />;
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
