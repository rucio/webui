import React, {useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {UseChunkedStream} from '@/lib/infrastructure/hooks/useChunkedStream';
import {StreamedTable} from '@/component-library/features/table/StreamedTable/StreamedTable';
import {ClickableCell} from '@/component-library/features/table/cells/ClickableCell';
import {badgeCellClasses, badgeCellWrapperStyle} from '@/component-library/features/table/cells/badge-cell';
import {
    DefaultTextFilterParams,
    DefaultDateFilterParams, buildDiscreteFilterParams
} from '@/component-library/features/utils/filter-parameters';
import {GridReadyEvent, ValueFormatterParams} from 'ag-grid-community';
import {RuleViewModel} from "@/lib/infrastructure/data/view-model/rule";
import {formatDate, formatSeconds} from "@/component-library/features/utils/text-formatters";
import {RuleStateBadge} from "@/component-library/features/badges/Rule/RuleStateBadge";
import {RuleState} from "@/lib/core/entity/rucio";

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
        // TODO: find out if stating account is needed
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
            valueFormatter: (params: ValueFormatterParams) => {
                return formatSeconds(params.value)
            }
        },
        {
            headerName: 'State',
            field: 'state',
            cellStyle: badgeCellWrapperStyle,
            cellRenderer: RuleStateBadge,
            cellRendererParams: {
                className: badgeCellClasses,
            },
            filter: true,
            sortable: false,
            // TODO: fix the string values
            filterParams: buildDiscreteFilterParams(Object.values(RuleState)),
        },
        // TODO: minified header with a tooltip
        {
            headerName: 'OK',
            field: 'locks_ok_cnt'
        },
        {
            headerName: 'Replicating',
            field: 'locks_replicating_cnt'
        },
        {
            headerName: 'Stuck',
            field: 'locks_stuck_cnt'
        }
    ]);

    return <StreamedTable columnDefs={columnDefs} tableRef={tableRef} {...props} />;
};
