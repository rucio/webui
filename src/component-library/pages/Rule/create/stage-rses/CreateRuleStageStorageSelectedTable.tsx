import React, { useRef, useState } from 'react';
import { ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { formatFileSize } from '@/component-library/features/utils/text-formatters';
import { RegularTable } from '@/component-library/features/table/RegularTable/RegularTable';
import { RSEAccountUsageLimitViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { RemovableCell } from '@/component-library/features/table/cells/selection-cells';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';

type StageStorageSelectedTableProps = {
    rowData: RSEAccountUsageLimitViewModel[];
    removeRSE: (item: RSEAccountUsageLimitViewModel) => void;
};

export const CreateRuleStageStorageSelectedTable = (props: StageStorageSelectedTableProps) => {
    const tableRef = useRef<AgGridReact<RSEAccountUsageLimitViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'RSE',
            field: 'rse',
            flex: 1,
            pinned: 'left' as const,
            cellRenderer: (params: ICellRendererParams<RSEAccountUsageLimitViewModel>) => {
                const rse = params.data!;
                return <RemovableCell onClick={() => props.removeRSE(rse)} {...params} />;
            },
            minWidth: 200,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Used',
            field: 'used_bytes',
            valueFormatter: (params: ValueFormatterParams) => {
                return formatFileSize(params.value);
            },
            minWidth: 120,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'Limit',
            field: 'bytes_limit',
            valueFormatter: (params: ValueFormatterParams) => {
                if (params.value === -1) {
                    return 'Unlimited';
                }
                return formatFileSize(params.value);
            },
            minWidth: 120,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'Remaining',
            field: 'bytes_remaining',
            valueFormatter: (params: ValueFormatterParams) => {
                const rse = params.data as RSEAccountUsageLimitViewModel;
                if (rse.bytes_limit === -1) {
                    return 'Unlimited';
                }
                return formatFileSize(params.value);
            },
            minWidth: 120,
            filter: 'agNumberColumnFilter',
        },
    ]);

    return <RegularTable columnDefs={columnDefs} tableRef={tableRef} {...props} />;
};
