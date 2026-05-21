'use client';

import { useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { GridReadyEvent, SelectionChangedEvent, ValueGetterParams } from 'ag-grid-community';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { DefaultTextFilterParams, DefaultDateFilterParams } from '@/component-library/features/utils/filter-parameters';
import { DateCellRenderer } from '@/component-library/features/utils/DateWithTooltip';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';
import { Button } from '@/component-library/atoms/form/button';
import { HiOutlineBan, HiOutlineExternalLink } from 'react-icons/hi';
import { SuspiciousReplicaViewModel } from '@/lib/infrastructure/data/view-model/replica';

type SuspiciousReplicasTableProps = {
    streamingHook: UseStreamReader<SuspiciousReplicaViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
    /** Per-row "Declare bad" action — opens the dialog for a single replica. */
    onDeclareBad: (replica: SuspiciousReplicaViewModel) => void;
    /** Notifies the parent of the current selection (multi-row checkboxes). */
    onSelectionChanged: (selected: SuspiciousReplicaViewModel[]) => void;
};

interface ActionsCellParams {
    data: SuspiciousReplicaViewModel | undefined;
    onDeclareBad: (replica: SuspiciousReplicaViewModel) => void;
}

const ActionsCell = ({ data, onDeclareBad }: ActionsCellParams) => {
    if (!data || data.status !== 'success') return null;
    return (
        <div className="flex items-center gap-1 h-full">
            <Button
                size="sm"
                variant="error"
                className="h-7 px-2 text-xs"
                onClick={e => {
                    e.stopPropagation();
                    onDeclareBad(data);
                }}
            >
                <HiOutlineBan className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                Declare bad
            </Button>
            <Button
                size="sm"
                variant="neutral"
                className="h-7 px-2 text-xs"
                onClick={e => {
                    e.stopPropagation();
                    window.open(`/did/${encodeURIComponent(data.scope)}/${encodeURIComponent(data.name)}`, '_blank');
                }}
            >
                <HiOutlineExternalLink className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                View
            </Button>
        </div>
    );
};

const ClickableDIDName = (props: { data: SuspiciousReplicaViewModel | undefined }) => {
    if (!props.data) return null;
    const { scope, name } = props.data;
    return <ClickableCell href={`/did/${encodeURIComponent(scope)}/${encodeURIComponent(name)}`}>{name}</ClickableCell>;
};

const ClickableRSE = (props: { value: string }) => {
    if (!props.value) return null;
    return <ClickableCell href={`/rse/${encodeURIComponent(props.value)}`}>{props.value}</ClickableCell>;
};

export const SuspiciousReplicasTable = (props: SuspiciousReplicasTableProps) => {
    const { onDeclareBad, onSelectionChanged, ...tableProps } = props;
    const tableRef = useRef<AgGridReact<SuspiciousReplicaViewModel>>(null);

    const columnDefs = useMemo(
        () => [
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
                headerName: 'Scope',
                field: 'scope',
                flex: 1,
                minWidth: 140,
                filter: true,
                filterParams: DefaultTextFilterParams,
                sortable: true,
            },
            {
                headerName: 'Name',
                field: 'name',
                flex: 2,
                minWidth: 260,
                filter: true,
                filterParams: DefaultTextFilterParams,
                sortable: true,
                cellRenderer: ClickableDIDName,
            },
            {
                headerName: 'RSE',
                field: 'rse',
                flex: 1,
                minWidth: 180,
                filter: true,
                filterParams: DefaultTextFilterParams,
                sortable: true,
                cellRenderer: ClickableRSE,
            },
            {
                headerName: 'Created At',
                field: 'createdAt',
                flex: 1,
                minWidth: 180,
                cellRenderer: DateCellRenderer,
                filter: 'agDateColumnFilter',
                filterParams: DefaultDateFilterParams,
                sortable: true,
            },
            {
                headerName: 'Count',
                field: 'cnt',
                width: 100,
                minWidth: 100,
                filter: 'agNumberColumnFilter',
                sortable: true,
                sort: 'desc' as const,
            },
            {
                headerName: 'Actions',
                colId: 'actions',
                width: 200,
                minWidth: 200,
                sortable: false,
                filter: false,
                resizable: false,
                pinned: 'right' as const,
                cellRenderer: ActionsCell,
                cellRendererParams: { onDeclareBad },
                valueGetter: (params: ValueGetterParams<SuspiciousReplicaViewModel>) => params.data?.name,
            },
        ],
        [onDeclareBad],
    );

    const handleGridReady = (event: GridReadyEvent) => {
        tableProps.onGridReady(event);
        // Default sort: count descending (AC #5).
        event.api.applyColumnState({
            state: [{ colId: 'cnt', sort: 'desc' }],
            defaultState: { sort: null },
        });
    };

    const handleSelectionChanged = (event: SelectionChangedEvent<SuspiciousReplicaViewModel>) => {
        onSelectionChanged(event.api.getSelectedRows());
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
