'use client';

import React, { useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ICellRendererParams } from 'ag-grid-community';
import { RegularTable } from '@/component-library/features/table/RegularTable/RegularTable';
import { CopyableCell } from '@/component-library/features/table/cells/CopyableCell';
import { ActionCell } from '@/component-library/features/table/cells/ActionCell';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { AgGridMultiSelectFilter, createMultiSelectFilterHandler } from '@/component-library/features/table/filters/AgGridMultiSelectFilter';
import { IdentityTypeBadge, IDENTITY_TYPE_BADGES } from '@/component-library/features/badges/account/IdentityTypeBadge';
import { AccountIdentity, IDENTITY_TYPES, IdentityType } from '@/lib/core/entity/account';

const typeOptions: IdentityType[] = [...IDENTITY_TYPES];
const typeValueFormatter = (value: IdentityType) => IDENTITY_TYPE_BADGES[value].label;

/** Identity strings can be long (SSH keys, DNs): truncated, monospace, full value in the tooltip, click to copy. */
export const IdentityCell = ({ value }: { value: string }) => (
    <CopyableCell text={value} className="min-w-0">
        <span className="font-mono truncate" title={value}>
            {value}
        </span>
    </CopyableCell>
);

export interface AccountIdentitiesTableProps {
    identities: AccountIdentity[];
    /** Show the Delete action (admins, when the area's accounts.manage.* flag is on). */
    canManage: boolean;
    onDelete?: (identity: AccountIdentity) => void;
    /** A mutation is running: row actions are disabled. */
    busy?: boolean;
}

export const AccountIdentitiesTable = ({ identities, canManage, onDelete, busy = false }: AccountIdentitiesTableProps) => {
    const tableRef = useRef<AgGridReact<AccountIdentity>>(null);
    // Keep the column definitions stable while the callback changes identity on every render.
    const onDeleteRef = useRef(onDelete);
    onDeleteRef.current = onDelete;

    const columnDefs = useMemo(
        () => [
            {
                headerName: 'Identity',
                field: 'identity' as const,
                flex: 3,
                minWidth: 260,
                cellRenderer: IdentityCell,
                filterParams: DefaultTextFilterParams,
            },
            {
                headerName: 'Type',
                field: 'type' as const,
                flex: 1,
                minWidth: 120,
                cellStyle: badgeCellWrapperStyle,
                cellRenderer: IdentityTypeBadge,
                cellRendererParams: { className: badgeCellClasses },
                filter: {
                    component: AgGridMultiSelectFilter,
                    handler: createMultiSelectFilterHandler(typeOptions, typeValueFormatter),
                },
                filterParams: { options: typeOptions, valueFormatter: typeValueFormatter },
            },
            {
                headerName: 'Email',
                field: 'email' as const,
                flex: 2,
                minWidth: 200,
                filterParams: DefaultTextFilterParams,
            },
            ...(canManage
                ? [
                      {
                          headerName: '',
                          colId: 'actions',
                          width: 110,
                          flex: 0,
                          sortable: false,
                          filter: false,
                          floatingFilter: false,
                          cellRenderer: (params: ICellRendererParams<AccountIdentity>) => (
                              <ActionCell
                                  actions={[
                                      {
                                          label: 'Delete',
                                          icon: 'delete',
                                          variant: 'error',
                                          disabled: busy,
                                          onClick: () => params.data && onDeleteRef.current?.(params.data),
                                      },
                                  ]}
                              />
                          ),
                      },
                  ]
                : []),
        ],
        // busy is a dependency so AG Grid re-renders the action cells when it changes
        [canManage, busy],
    );

    return <RegularTable columnDefs={columnDefs} tableRef={tableRef} rowData={identities} enableFilterHandlers />;
};
