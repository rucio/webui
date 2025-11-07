// WebUI Tutorial Example Component
// This component demonstrates the list-subscriptions table from the Developer Onboarding Tutorial
// It displays individual subscription records with fields like name, state, created_at, etc.

import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { SubscriptionViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { GridReadyEvent } from 'ag-grid-community';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';

type ListSubscriptionTutorialTableProps = {
    streamingHook: UseStreamReader<SubscriptionViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
    account: string;
};

const ClickableName = (props: { value: string; account: string }) => {
    return (
        <ClickableCell href={`/subscription/page/${props.account}/${props.value}`}>
            {props.value}
        </ClickableCell>
    );
};

export const ListSubscriptionTutorialTable = (props: ListSubscriptionTutorialTableProps) => {
    const tableRef = useRef<AgGridReact<SubscriptionViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'Name',
            field: 'name',
            flex: 5,
            minWidth: 300,
            cellRenderer: ClickableName,
            cellRendererParams: { account: props.account },
            filter: true,
        },
        {
            headerName: 'State',
            field: 'state',
            flex: 2,
            minWidth: 150,
        },
        {
            headerName: 'Created',
            field: 'created_at',
            flex: 3,
            minWidth: 200,
        },
    ]);

    return (
        <StreamedTable
            columnDefs={columnDefs}
            tableRef={tableRef}
            {...props}
        />
    );
};
