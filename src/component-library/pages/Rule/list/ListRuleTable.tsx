import React, {useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {UseChunkedStream} from '@/lib/infrastructure/hooks/useChunkedStream';
import {RSEViewModel} from '@/lib/infrastructure/data/view-model/rse';
import {StreamedTable} from '@/component-library/features/table/StreamedTable/StreamedTable';
import {ClickableCell} from '@/component-library/features/table/cells/ClickableCell';
import {badgeCellClasses, badgeCellWrapperStyle} from '@/component-library/features/table/cells/badge-cell';
import {CheckboxCell, checkboxCellWrapperStyle} from '@/component-library/features/table/cells/CheckboxCell';
import {
    DefaultTextFilterParams,
    DefaultBooleanFilterParams,
    buildDiscreteFilterParams, DefaultDateFilterParams
} from '@/component-library/features/utils/filter-parameters';
import {GridReadyEvent, ValueFormatterParams} from 'ag-grid-community';
import {RSETypeBadge} from '@/component-library/features/badges/RSE/RSETypeBadge';
import {RSEType} from '@/lib/core/entity/rucio';
import {RuleViewModel} from "@/lib/infrastructure/data/view-model/rule";
import {formatDate} from "@/component-library/features/utils/text-formatters";

type ListRuleTableProps = {
    streamingHook: UseChunkedStream<RuleViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
};

const ClickableId = (props: { value: string }) => {
    return <ClickableCell href={`/rule/page/${props.value}`}>{props.value}</ClickableCell>;
};

export const ListRuleTable = (props: ListRuleTableProps) => {
    const tableRef = useRef<AgGridReact<RuleViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'ID',
            field: 'id',
            flex: 4,
            minWidth: 250,
            cellRenderer: ClickableId,
        },
        {
            headerName: 'Name',
            field: 'name',
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        // {
        //     headerName: 'Account',
        //     field: 'account',
        //     filter: true,
        //     filterParams: DefaultTextFilterParams,
        // },
        {
            headerName: 'RSE',
            field: 'rse_expression',
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Created At',
            field: 'created_at',
            valueFormatter: (params: ValueFormatterParams) => {
                return formatDate(params.value);
            },
            filter: 'agDateColumnFilter',
            filterParams: DefaultDateFilterParams,
        },
        {
            headerName: 'Remaining Lifetime',
            field: 'remaining_lifetime',
        },
    ]);

    return <StreamedTable columnDefs={columnDefs} tableRef={tableRef} {...props} />;
};
