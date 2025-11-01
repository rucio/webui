import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import {
    DefaultTextFilterParams,
    DefaultDateFilterParams,
    buildDiscreteFilterParams,
    RuleStateDisplayNames,
} from '@/component-library/features/utils/filter-parameters';
import { GridReadyEvent, ValueFormatterParams, ValueGetterParams } from 'ag-grid-community';
import { RuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { formatDate, formatSeconds } from '@/component-library/features/utils/text-formatters';
import { RuleStateBadge } from '@/component-library/features/badges/Rule/RuleStateBadge';
import { RuleState } from '@/lib/core/entity/rucio';
import { NullBadge } from '@/component-library/features/badges/NullBadge';
import { ruleActivityComparator } from '@/lib/core/utils/rule-sorting-utils';

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

const NullableRemainingLifetime = (props: { value: number }) => {
    const timeString = formatSeconds(props.value);
    if (!timeString) {
        return <NullBadge />;
    }
    return timeString;
};

export const ListRuleTable = (props: ListRuleTableProps) => {
    const tableRef = useRef<AgGridReact<RuleViewModel>>(null);


    const [columnDefs] = useState([
        {
            headerName: 'DID',
            valueGetter: (params: ValueGetterParams<RuleViewModel>) => {
                return [params.data?.scope, params.data?.name];
            },
            minWidth: 400,
            flex: 2,
            filter: true,
            filterParams: DefaultTextFilterParams,
            cellRenderer: ClickableDID,
            pinned: 'left' as const,
        },
        {
            headerName: 'ID',
            field: 'id',
            width: 50,
            minWidth: 250,
            flex: 1,
            sortable: false,
            cellRenderer: ClickableId,
            pinned: 'left' as const,
        },
        {
            headerName: 'RSE Expression',
            field: 'rse_expression',
            minWidth: 160,
            flex: 1,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'State',
            field: 'state',
            width: 150,
            minWidth: 150,
            cellStyle: badgeCellWrapperStyle,
            cellRenderer: RuleStateBadge,
            cellRendererParams: {
                className: badgeCellClasses,
            },
            filter: true,
            sortable: false,
            filterParams: buildDiscreteFilterParams(Object.values(RuleStateDisplayNames), Object.values(RuleState)),
        },
        // TODO: minified header with a tooltip
        {
            headerName: 'OK',
            field: 'locks_ok_cnt',
            width: 80,
            minWidth: 80,
            sortable: false,
        },
        {
            headerName: 'Replicating',
            field: 'locks_replicating_cnt',
            width: 125,
            minWidth: 125,
            sortable: false,
        },
        {
            headerName: 'Stuck',
            field: 'locks_stuck_cnt',
            width: 95,
            minWidth: 95,
            sortable: true,
            comparator: ruleActivityComparator,
        },
        {
            headerName: 'Account',
            field: 'account',
            minWidth: 120,
            flex: 1,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Created At',
            field: 'created_at',
            width: 140,
            minWidth: 140,
            valueFormatter: (params: ValueFormatterParams) => {
                return formatDate(params.value);
            },
            filter: 'agDateColumnFilter',
            filterParams: DefaultDateFilterParams,
        },
        {
            headerName: 'Remaining',
            field: 'remaining_lifetime',
            width: 140,
            minWidth: 140,
            cellRenderer: NullableRemainingLifetime,
        },
    ]);

    const onGridReady = (event: GridReadyEvent) => {
        props.onGridReady(event);
        // Apply default sort to prioritize stuck rules
        event.api.applyColumnState({
            state: [
                {
                    colId: 'locks_stuck_cnt',
                    sort: 'desc',
                },
            ],
        });
    };

    return <StreamedTable columnDefs={columnDefs} tableRef={tableRef} {...props} onGridReady={onGridReady} />;
};
