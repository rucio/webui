'use client';

import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { GridReadyEvent } from 'ag-grid-community';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { AccountListItemViewModel } from '@/lib/infrastructure/data/view-model/account';
import { ACCOUNT_TYPES, ACCOUNT_TYPE_LABELS, KnownAccountType } from '@/lib/core/entity/rucio';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { ClickableAccountCell } from '@/component-library/features/table/cells/ClickableCellsCollection';
import { CopyableCell } from '@/component-library/features/table/cells/CopyableCell';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { AgGridMultiSelectFilter, createMultiSelectFilterHandler } from '@/component-library/features/table/filters/AgGridMultiSelectFilter';
import { AccountTypeBadge } from '@/component-library/features/badges/account/AccountTypeBadge';
import { NullBadge } from '@/component-library/features/badges/NullBadge';

export const AccountEmailCell = (props: { value: string | null }) =>
    props.value ? <CopyableCell text={props.value} /> : <NullBadge label="none" className="my-2" />;

export interface ListAccountsTableProps {
    streamingHook: UseStreamReader<AccountListItemViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
}

export const ListAccountsTable = (props: ListAccountsTableProps) => {
    const tableRef = useRef<AgGridReact<AccountListItemViewModel>>(null);
    const typeOptions = [...ACCOUNT_TYPES];
    const typeLabel = (type: KnownAccountType) => ACCOUNT_TYPE_LABELS[type];

    const [columnDefs] = useState([
        {
            headerName: 'Account',
            field: 'account',
            flex: 3,
            minWidth: 220,
            pinned: 'left' as const,
            cellRenderer: ClickableAccountCell,
            filter: true,
            filterParams: DefaultTextFilterParams,
            sort: 'asc' as const,
        },
        {
            headerName: 'Type',
            field: 'accountType',
            flex: 1,
            minWidth: 125,
            cellStyle: badgeCellWrapperStyle,
            cellRenderer: AccountTypeBadge,
            cellRendererParams: { className: badgeCellClasses },
            filter: {
                component: AgGridMultiSelectFilter,
                handler: createMultiSelectFilterHandler(typeOptions, typeLabel),
            },
            filterParams: { options: typeOptions, valueFormatter: typeLabel },
        },
        {
            headerName: 'Email',
            field: 'email',
            flex: 3,
            minWidth: 220,
            cellRenderer: AccountEmailCell,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
    ]);

    return <StreamedTable columnDefs={columnDefs} tableRef={tableRef} {...props} enableFilterHandlers />;
};
