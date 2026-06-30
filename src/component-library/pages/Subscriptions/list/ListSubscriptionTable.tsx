import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { SubscriptionRuleStatesViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { GridReadyEvent } from 'ag-grid-community';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { RuleStateBadge } from '@/component-library/features/badges/Rule/RuleStateBadge';
import { RuleState, SubscriptionState } from '@/lib/core/entity/rucio';
import { badgeCellClasses } from '@/component-library/features/table/cells/badge-cell';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';
import { SubscriptionStateBadge, subscriptionStateString } from '@/component-library/features/badges/Subscription/SubscriptionStateBadge';

type ListSubscriptionTableProps = {
    streamingHook: UseStreamReader<SubscriptionRuleStatesViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
    account: string;
};

const ClickableName = (props: { value: string; account: string }) => {
    return <ClickableCell href={`/subscription/${props.account}/${props.value}`}>{props.value}</ClickableCell>;
};

export const ListSubscriptionTable = (props: ListSubscriptionTableProps) => {
    const tableRef = useRef<AgGridReact<SubscriptionRuleStatesViewModel>>(null);
    const stateMinWidth = 175;

    const [columnDefs] = useState([
        {
            headerName: 'Name',
            field: 'name',
            flex: 5,
            minWidth: 300,
            pinned: 'left' as const,
            cellRenderer: ClickableName,
            cellRendererParams: {
                account: props.account,
            },
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'State',
            field: 'subscriptionState',
            minWidth: 140,
            cellRenderer: (params: { value: SubscriptionState }) => (
                <SubscriptionStateBadge value={params.value ?? SubscriptionState.UNKNOWN} className={badgeCellClasses} />
            ),
            filter: true,
            filterParams: DefaultTextFilterParams,
            // The cell value is the enum code (e.g. 'A'); filter against the displayed
            // label (e.g. 'Active') so text searches match what the user sees.
            filterValueGetter: (params: { data?: SubscriptionRuleStatesViewModel }) =>
                subscriptionStateString[params.data?.subscriptionState ?? SubscriptionState.UNKNOWN],
        },
        {
            headerName: 'OK',
            field: 'state_ok',
            minWidth: stateMinWidth,
            headerComponent: RuleStateBadge,
            headerComponentParams: {
                className: badgeCellClasses,
                value: RuleState.OK,
            },
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'Replicating',
            field: 'state_replicating',
            minWidth: stateMinWidth,
            headerComponent: RuleStateBadge,
            headerComponentParams: {
                className: badgeCellClasses,
                value: RuleState.REPLICATING,
            },
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'Stuck',
            field: 'state_stuck',
            minWidth: stateMinWidth,
            headerComponent: RuleStateBadge,
            headerComponentParams: {
                className: badgeCellClasses,
                value: RuleState.STUCK,
            },
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'Suspended',
            field: 'state_suspended',
            minWidth: stateMinWidth,
            headerComponent: RuleStateBadge,
            headerComponentParams: {
                className: badgeCellClasses,
                value: RuleState.SUSPENDED,
            },
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'Waiting Approval',
            field: 'state_waiting_approval',
            minWidth: stateMinWidth,
            headerComponent: RuleStateBadge,
            headerComponentParams: {
                className: badgeCellClasses,
                value: RuleState.WAITING_APPROVAL,
            },
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'Inject',
            field: 'state_inject',
            minWidth: stateMinWidth,
            headerComponent: RuleStateBadge,
            headerComponentParams: {
                className: badgeCellClasses,
                value: RuleState.INJECT,
            },
            filter: 'agNumberColumnFilter',
        },
    ]);

    return <StreamedTable columnDefs={columnDefs} tableRef={tableRef} {...props} />;
};
