import React, { useRef, useState } from 'react';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { ColSpanParams, ICellRendererParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { formatFileSize } from '@/component-library/features/utils/text-formatters';
import { RSEAccountUsageLimitViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { RegularTable } from '@/component-library/features/table/RegularTable/RegularTable';

type StageSummaryStageTableProps = {
    rowData: RSEAccountUsageLimitViewModel[];
};

const WarningCell = (props: { value: string; warn: boolean }) => {
    const textColor = props.warn ? 'text-base-error-500 font-semibold' : '';
    return <span className={textColor}>{props.value}</span>;
};

export const CreateRuleStageSummaryStorageTable: React.FC<StageSummaryStageTableProps> = ({ ...props }) => {
    const tableRef = useRef<AgGridReact<RSEAccountUsageLimitViewModel>>(null);

    // TODO: these should be calculated on the client side
    const [columnDefs] = useState([
        {
            headerName: 'Name',
            field: 'rse',
            minWidth: 250,
            flex: 1,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Quota',
            field: 'bytes_limit',
            cellRenderer: (params: ICellRendererParams) => {
                const item: RSEAccountUsageLimitViewModel = params.data;
                if (item.bytes_limit === -1 && item.has_quota) {
                    return 'Infinite';
                }
                const value = params.value < 0 ? 'No quota' : formatFileSize(params.value);
                return <WarningCell warn={!item.has_quota} {...params} value={value} />;
            },
            colSpan: (params: ColSpanParams) => {
                // Take up all the subsequent columns
                return params.data.bytes_limit < 0 ? 2 : 1;
            },
            minWidth: 200,
        },
        {
            headerName: 'Remaining',
            field: 'bytes_remaining',
            cellRenderer: (params: ICellRendererParams) => {
                const item: RSEAccountUsageLimitViewModel = params.data;
                const value = formatFileSize(item.bytes_remaining);
                return <WarningCell warn={!item.has_quota} {...params} value={value} />;
            },
            minWidth: 200,
        },
    ]);

    return <RegularTable tableRef={tableRef} columnDefs={columnDefs} {...props} />;
};
