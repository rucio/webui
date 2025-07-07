import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { DefaultTextFilterParams, DefaultDateFilterParams, buildDiscreteFilterParams } from '@/component-library/features/utils/filter-parameters';
import { GridReadyEvent, ValueFormatterParams, ValueGetterParams } from 'ag-grid-community';
import { RuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { formatDate, formatSeconds } from '@/component-library/features/utils/text-formatters';
import { RuleStateBadge } from '@/component-library/features/badges/Rule/RuleStateBadge';
import { RuleState } from '@/lib/core/entity/rucio';

type ListRuleTableProps = {
    streamingHook: UseStreamReader<RuleViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
};

const ClickableId = (props: { value: string }) => {
    return <ClickableCell href={`/rule/page/${props.value}`}>{props.value}</ClickableCell>;
};

const ClickableDID = (props: { value: string[] }) => {
    const [scope, name] = props.value;
    return (
        <ClickableCell href={`/did/page/${encodeURIComponent(scope)}/${encodeURIComponent(name)}`}>
            {scope}:{name}
        </ClickableCell>
    );
};

export const ListRuleTable = (props: ListRuleTableProps) => {
    const tableRef = useRef<AgGridReact<RuleViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'ID',
            field: 'id',
            flex: 2,
            width: 390,
            sortable: false,
            cellRenderer: ClickableId,
        },
        {
            headerName: 'DID',
            valueGetter: (params: ValueGetterParams<RuleViewModel>) => {
                return [params.data?.scope, params.data?.name];
            },
            minWidth: 150,
            flex: 1,
            filter: true,
            filterParams: DefaultTextFilterParams,
            cellRenderer: ClickableDID,
        },
        // TODO: find out if stating account is needed
        // {
        //     headerName: 'Account',
        //     field: 'account',
        //     filter: true,
        //     filterParams: DefaultTextFilterParams,
        // },
        {
            headerName: 'RSE Expression',
            field: 'rse_expression',
            minWidth: 150,
            flex: 1,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Created At',
            field: 'created_at',
            width: 150,
            valueFormatter: (params: ValueFormatterParams) => {
                return formatDate(params.value);
            },
            filter: 'agDateColumnFilter',
            filterParams: DefaultDateFilterParams,
        },
        {
            headerName: 'Remaining',
            field: 'remaining_lifetime',
            width: 125,
            valueFormatter: (params: ValueFormatterParams) => {
                return formatSeconds(params.value);
            },
        },
        {
            headerName: 'State',
            field: 'state',
            minWidth: 200,
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
            field: 'locks_ok_cnt',
            minWidth: 75,
            sortable: false,
        },
        {
            headerName: 'Replicating',
            field: 'locks_replicating_cnt',
            minWidth: 135,
            sortable: false,
        },
        {
            headerName: 'Stuck',
            field: 'locks_stuck_cnt',
            minWidth: 90,
            sortable: false,
        },
    ]);

    return <StreamedTable columnDefs={columnDefs} tableRef={tableRef} {...props} />;
};
