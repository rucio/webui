import React, { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { DefaultTextFilterParams, buildDiscreteFilterParams } from '@/component-library/features/utils/filter-parameters';
import { GridReadyEvent, ValueGetterParams } from 'ag-grid-community';
import { ListRuleReplicaLockStatesViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { LockState } from '@/lib/core/entity/rucio';
import { LockStateBadge } from '@/component-library/features/badges/Rule/LockStateBadge';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';

type DetailsRuleLocksTableProps = {
    streamingHook: UseStreamReader<ListRuleReplicaLockStatesViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
};

const DetailsRuleLocksTable = (props: DetailsRuleLocksTableProps) => {
    const tableRef = useRef<AgGridReact<ListRuleReplicaLockStatesViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'DID',
            valueGetter: (params: ValueGetterParams<ListRuleReplicaLockStatesViewModel>) => {
                return params.data?.scope + ':' + params.data?.name;
            },
            minWidth: 150,
            flex: 1,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'RSE',
            field: 'rse',
            minWidth: 150,
            flex: 1,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'State',
            field: 'state',
            minWidth: 200,
            cellStyle: badgeCellWrapperStyle,
            cellRenderer: LockStateBadge,
            cellRendererParams: {
                className: badgeCellClasses,
            },
            filter: true,
            sortable: false,
            // TODO: fix the string values
            filterParams: buildDiscreteFilterParams(Object.values(LockState)),
        },
        // TODO: add links
    ]);

    return <StreamedTable columnDefs={columnDefs} tableRef={tableRef} {...props} />;
};

export const DetailsRuleLocks = ({ id }: { id: string }) => {
    const { gridApi, onGridReady, streamingHook, startStreaming, stopStreaming } = useTableStreaming<ListRuleReplicaLockStatesViewModel>();

    useEffect(() => {
        if (gridApi) {
            const url = '/api/feature/list-rule-replica-lock-states?' + new URLSearchParams({ id });
            startStreaming(url);
        }
    }, [gridApi]);

    return <DetailsRuleLocksTable streamingHook={streamingHook} onGridReady={onGridReady} />;
};
