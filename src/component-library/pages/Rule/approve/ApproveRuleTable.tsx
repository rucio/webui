'use client';

import { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { GridReadyEvent, SelectionChangedEvent, ValueFormatterParams, ValueGetterParams } from 'ag-grid-community';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';
import { DefaultTextFilterParams, DefaultDateFilterParams } from '@/component-library/features/utils/filter-parameters';
import { ApproveRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { formatDate, formatFileSize, formatSeconds } from '@/component-library/features/utils/text-formatters';
import { NullBadge } from '@/component-library/features/badges/NullBadge';
import { DIDTypeBadge } from '@/component-library/features/badges/DID/DIDTypeBadge';
import { RuleGroupingBadge } from '@/component-library/features/badges/Rule/RuleGroupingBadge';
import { remainingLifetimeComparator } from '@/lib/core/utils/rule-sorting-utils';
import { ApproveRuleDialog } from '@/component-library/features/mutations/ApproveRuleDialog';
import { DenyRuleDialog } from '@/component-library/features/mutations/DenyRuleDialog';
import { Button } from '@/component-library/atoms/form/button';
import { HiOutlineCheckCircle, HiOutlineBan, HiOutlineExternalLink } from 'react-icons/hi';

export type ApproveRuleTableProps = {
    streamingHook: UseStreamReader<ApproveRuleViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
    onApprove: (ruleId: string) => void;
    onDeny: (ruleId: string, comment?: string) => void;
    approvingRuleId: string | null;
    denyingRuleId: string | null;
    onSelectionChanged?: (selectedIds: string[]) => void;
};

// ── Cell renderers ────────────────────────────────────────────────────────────

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

interface ActionsCellParams {
    value: string; // ruleId
    onApprove: (ruleId: string) => void;
    onDeny: (ruleId: string, comment?: string) => void;
    approvingRuleId: string | null;
    denyingRuleId: string | null;
}

const ActionsCell = ({ value: ruleId, onApprove, onDeny, approvingRuleId, denyingRuleId }: ActionsCellParams) => {
    const [approveOpen, setApproveOpen] = useState(false);
    const [denyOpen, setDenyOpen] = useState(false);

    const handleApproveConfirm = () => {
        onApprove(ruleId);
        setApproveOpen(false);
    };

    const handleDenyConfirm = (comment?: string) => {
        onDeny(ruleId, comment);
        setDenyOpen(false);
    };

    return (
        <div className="flex items-center gap-1 h-full">
            <Button
                size="sm"
                variant="success"
                onClick={e => { e.stopPropagation(); setApproveOpen(true); }}
                className="h-7 px-2 text-xs"
            >
                <HiOutlineCheckCircle className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                Approve
            </Button>
            <Button
                size="sm"
                variant="error"
                onClick={e => { e.stopPropagation(); setDenyOpen(true); }}
                className="h-7 px-2 text-xs"
            >
                <HiOutlineBan className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                Deny
            </Button>
            <Button
                size="sm"
                variant="neutral"
                onClick={e => { e.stopPropagation(); window.open(`/rule/${ruleId}`, '_blank'); }}
                className="h-7 px-2 text-xs"
            >
                <HiOutlineExternalLink className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                View
            </Button>
            {approveOpen && (
                <ApproveRuleDialog
                    open={approveOpen}
                    onOpenChange={setApproveOpen}
                    ruleId={ruleId}
                    onConfirm={handleApproveConfirm}
                    loading={approvingRuleId === ruleId}
                />
            )}
            {denyOpen && (
                <DenyRuleDialog
                    open={denyOpen}
                    onOpenChange={setDenyOpen}
                    ruleId={ruleId}
                    onConfirm={handleDenyConfirm}
                    loading={denyingRuleId === ruleId}
                />
            )}
        </div>
    );
};

// ── Main table component ──────────────────────────────────────────────────────

const ApproveRuleTable = (props: ApproveRuleTableProps) => {
    const { onApprove, onDeny, approvingRuleId, denyingRuleId, onSelectionChanged, ...tableProps } = props;
    const tableRef = useRef<AgGridReact<ApproveRuleViewModel>>(null);

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
        },
        {
            headerName: 'DID',
            valueGetter: (params: ValueGetterParams<ApproveRuleViewModel>) => {
                return [params.data?.scope, params.data?.name];
            },
            minWidth: 350,
            flex: 2,
            filter: true,
            filterParams: DefaultTextFilterParams,
            cellRenderer: ClickableDID,
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
            headerName: 'Filesize',
            field: 'bytes',
            width: 120,
            minWidth: 120,
            valueFormatter: (params: ValueFormatterParams) => {
                if (params.value == null) return '';
                return formatFileSize(params.value);
            },
            sortable: true,
        },
        {
            headerName: 'Length',
            field: 'length',
            width: 100,
            minWidth: 100,
            sortable: true,
        },
        {
            headerName: 'Open',
            field: 'open',
            width: 80,
            minWidth: 80,
            valueFormatter: (params: ValueFormatterParams) => {
                return params.value ? 'Yes' : 'No';
            },
            filter: true,
        },
        {
            headerName: 'DID Type',
            field: 'did_type',
            width: 110,
            minWidth: 110,
            cellRenderer: DIDTypeBadge,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Grouping',
            field: 'grouping',
            width: 110,
            minWidth: 110,
            cellRenderer: RuleGroupingBadge,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Comment',
            field: 'comments',
            minWidth: 150,
            flex: 1,
            cellRenderer: (params: { value: string | null }) => {
                if (!params.value) return <NullBadge />;
                return params.value;
            },
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Actions',
            colId: 'actions',
            width: 250,
            minWidth: 250,
            sortable: false,
            filter: false,
            pinned: 'right' as const,
            cellRenderer: ActionsCell,
            cellRendererParams: {
                onApprove,
                onDeny,
                approvingRuleId,
                denyingRuleId,
            },
            valueGetter: (params: ValueGetterParams<ApproveRuleViewModel>) => params.data?.id,
        },
    ]);

    const handleGridReady = (event: GridReadyEvent) => {
        tableProps.onGridReady(event);
    };

    const handleSelectionChanged = (event: SelectionChangedEvent<ApproveRuleViewModel>) => {
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
