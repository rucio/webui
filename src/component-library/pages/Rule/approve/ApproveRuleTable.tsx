'use client';

import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { GridReadyEvent, SelectionChangedEvent, ValueFormatterParams, ValueGetterParams } from 'ag-grid-community';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';
import { DefaultTextFilterParams, DefaultDateFilterParams } from '@/component-library/features/utils/filter-parameters';
import { RuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { formatDate, formatSeconds } from '@/component-library/features/utils/text-formatters';
import { NullBadge } from '@/component-library/features/badges/NullBadge';
import { ruleActivityComparator, remainingLifetimeComparator } from '@/lib/core/utils/rule-sorting-utils';
import { ApproveRuleDialog } from '@/component-library/features/mutations/ApproveRuleDialog';
import { DenyRuleDialog } from '@/component-library/features/mutations/DenyRuleDialog';
import { Button } from '@/component-library/atoms/form/button';
import { HiOutlineCheckCircle, HiOutlineBan } from 'react-icons/hi';

export type ApproveRuleTableProps = {
    streamingHook: UseStreamReader<RuleViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
    onApprove: (ruleId: string) => void;
    onDeny: (ruleId: string, comment?: string) => void;
    approvingRuleId: string | null;
    denyingRuleId: string | null;
    onSelectionChanged?: (selectedIds: string[]) => void;
};

// ── Cell renderers ────────────────────────────────────────────────────────────

const ClickableId = (props: { value: string }) => {
    return <ClickableCell href={`/rule/${props.value}`}>{props.value}</ClickableCell>;
};

const ClickableDID = (props: { value: string[] }) => {
    const [scope, name] = props.value;
    return (
        <ClickableCell href={`/did/${encodeURIComponent(scope)}/${encodeURIComponent(name)}`}>
            {scope}:{name}
        </ClickableCell>
    );
};

const ClickableRSEExpression = (props: { value: string }) => {
    return <ClickableCell href={`/rses?expression=${encodeURIComponent(props.value)}&autoSearch=true`}>{props.value}</ClickableCell>;
};

const NullableRemainingLifetime = (props: { value: number }) => {
    const timeString = formatSeconds(props.value);
    if (!timeString) {
        return <NullBadge />;
    }
    return timeString;
};

interface ApproveActionCellParams {
    value: string; // ruleId
    onApprove: (ruleId: string) => void;
    approvingRuleId: string | null;
}

const ApproveActionCell = ({ value: ruleId, onApprove, approvingRuleId }: ApproveActionCellParams) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = () => {
        onApprove(ruleId);
        setIsOpen(false);
    };

    return (
        <>
            <Button size="sm" variant="success" onClick={() => setIsOpen(true)} className="h-7 px-2 text-xs">
                <HiOutlineCheckCircle className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                Approve
            </Button>
            <ApproveRuleDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                ruleId={ruleId}
                onConfirm={handleConfirm}
                loading={approvingRuleId === ruleId}
            />
        </>
    );
};

interface DenyActionCellParams {
    value: string; // ruleId
    onDeny: (ruleId: string, comment?: string) => void;
    denyingRuleId: string | null;
}

const DenyActionCell = ({ value: ruleId, onDeny, denyingRuleId }: DenyActionCellParams) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = (comment?: string) => {
        onDeny(ruleId, comment);
        setIsOpen(false);
    };

    return (
        <>
            <Button size="sm" variant="error" onClick={() => setIsOpen(true)} className="h-7 px-2 text-xs">
                <HiOutlineBan className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                Deny
            </Button>
            <DenyRuleDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                ruleId={ruleId}
                onConfirm={handleConfirm}
                loading={denyingRuleId === ruleId}
            />
        </>
    );
};

// ── Main table component ──────────────────────────────────────────────────────

const ApproveRuleTable = (props: ApproveRuleTableProps) => {
    const { onApprove, onDeny, approvingRuleId, denyingRuleId, onSelectionChanged, ...tableProps } = props;
    const tableRef = useRef<AgGridReact<RuleViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 48,
            minWidth: 48,
            maxWidth: 48,
            suppressMenu: true,
            sortable: false,
            filter: false,
            resizable: false,
            pinned: 'left' as const,
        },
        {
            headerName: 'DID',
            valueGetter: (params: ValueGetterParams<RuleViewModel>) => {
                return [params.data?.scope, params.data?.name];
            },
            minWidth: 350,
            flex: 2,
            filter: true,
            filterParams: DefaultTextFilterParams,
            cellRenderer: ClickableDID,
            pinned: 'left' as const,
        },
        {
            headerName: 'ID',
            field: 'id',
            width: 200,
            flex: 1,
            cellRenderer: ClickableId,
            pinned: 'left' as const,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'RSE Expression',
            field: 'rse_expression',
            minWidth: 160,
            flex: 1,
            cellRenderer: ClickableRSEExpression,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'OK',
            field: 'locks_ok_cnt',
            width: 80,
            minWidth: 80,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'Replicating',
            field: 'locks_replicating_cnt',
            width: 125,
            minWidth: 125,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'Stuck',
            field: 'locks_stuck_cnt',
            width: 95,
            minWidth: 95,
            sortable: true,
            comparator: ruleActivityComparator,
            filter: 'agNumberColumnFilter',
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
            sortable: true,
            comparator: remainingLifetimeComparator,
        },
        {
            headerName: 'Approve',
            field: 'id',
            colId: 'approve-action',
            width: 110,
            minWidth: 110,
            sortable: false,
            filter: false,
            cellRenderer: ApproveActionCell,
            cellRendererParams: {
                onApprove,
                approvingRuleId,
            },
        },
        {
            headerName: 'Deny',
            field: 'id',
            colId: 'deny-action',
            width: 100,
            minWidth: 100,
            sortable: false,
            filter: false,
            cellRenderer: DenyActionCell,
            cellRendererParams: {
                onDeny,
                denyingRuleId,
            },
        },
    ]);

    const handleGridReady = (event: GridReadyEvent) => {
        tableProps.onGridReady(event);
    };

    const handleSelectionChanged = (event: SelectionChangedEvent<RuleViewModel>) => {
        if (!onSelectionChanged) return;
        const selectedRows = event.api.getSelectedRows();
        onSelectionChanged(selectedRows.map(row => row.id));
    };

    return (
        <StreamedTable
            columnDefs={columnDefs}
            tableRef={tableRef}
            streamingHook={tableProps.streamingHook}
            onGridReady={handleGridReady}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            onSelectionChanged={handleSelectionChanged}
        />
    );
};

export default ApproveRuleTable;
