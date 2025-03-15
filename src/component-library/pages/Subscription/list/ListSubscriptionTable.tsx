import React, { useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { SubscriptionRuleStatesViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { GridReadyEvent } from 'ag-grid-community';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { RuleStateBadge } from '@/component-library/features/badges/Rule/RuleStateBadge';
import { RuleState } from '@/lib/core/entity/rucio';
import { badgeCellClasses } from '@/component-library/features/table/cells/badge-cell';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';

type ListSubscriptionTableProps = {
    streamingHook: UseStreamReader<SubscriptionRuleStatesViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
    account: string;
};

const ClickableName = ({ value, account }: { value: string; account: string }) => (
    <ClickableCell href={`/subscription/page/${account}/${value}`}>{value}</ClickableCell>
);

const createRuleStateColumn = (headerName: string, field: keyof SubscriptionRuleStatesViewModel, value: RuleState) => ({
    headerName,
    field,
    minWidth: 125,
    headerComponent: RuleStateBadge,
    headerComponentParams: { className: badgeCellClasses, value },
});

export const ListSubscriptionTable = (props: ListSubscriptionTableProps) => {
    const tableRef = useRef<AgGridReact<SubscriptionRuleStatesViewModel>>(null);

    const columnDefs = [
        {
            headerName: 'Name',
            field: 'name',
            flex: 5,
            minWidth: 300,
            cellRenderer: ClickableName,
            cellRendererParams: { account: props.account },
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        createRuleStateColumn('OK', 'state_ok', RuleState.OK),
        createRuleStateColumn('Replicating', 'state_replicating', RuleState.REPLICATING),
        createRuleStateColumn('Stuck', 'state_stuck', RuleState.STUCK),
        createRuleStateColumn('Suspended', 'state_suspended', RuleState.SUSPENDED),
        createRuleStateColumn('Waiting Approval', 'state_waiting_approval', RuleState.WAITING_APPROVAL),
        createRuleStateColumn('Inject', 'state_inject', RuleState.INJECT),
    ];

    return <StreamedTable columnDefs={columnDefs} tableRef={tableRef} {...props} />;
};
