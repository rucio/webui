'use client';

import React, { useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ICellRendererParams } from 'ag-grid-community';
import { RegularTable } from '@/component-library/features/table/RegularTable/RegularTable';
import { AttributeCell } from '@/component-library/features/table/cells/AttributeCell';
import { ActionCell } from '@/component-library/features/table/cells/ActionCell';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { Badge } from '@/component-library/atoms/misc/Badge';
import { AccountAttribute } from '@/lib/core/entity/account';

/** Keys with a meaning in the WebUI get a small badge: `admin` (role) and `country-*` (country role). */
export const attributeKeyBadge = (key: string): string | undefined => {
    if (key === 'admin') return 'Admin';
    if (key.startsWith('country-')) return 'Country';
    return undefined;
};

export const AttributeKeyCell = ({ value }: { value: string }) => {
    const badge = attributeKeyBadge(value);
    return (
        <span className="flex items-center gap-2 h-full">
            <span>{value}</span>
            {badge && <Badge value={badge} variant="info" size="sm" />}
        </span>
    );
};

export interface AccountAttributesTableProps {
    attributes: AccountAttribute[];
    /** Show the Edit and Delete actions (admins, when the area's accounts.manage.* flag is on). */
    canManage: boolean;
    onEdit?: (attribute: AccountAttribute) => void;
    onDelete?: (attribute: AccountAttribute) => void;
    /** A mutation is running: row actions are disabled. */
    busy?: boolean;
}

/** Account attributes, modelled on DetailsRSEAttributesTable, plus Edit and Delete actions. */
export const AccountAttributesTable = ({ attributes, canManage, onEdit, onDelete, busy = false }: AccountAttributesTableProps) => {
    const tableRef = useRef<AgGridReact<AccountAttribute>>(null);
    // Keep the column definitions stable while the callback changes identity on every render.
    const onEditRef = useRef(onEdit);
    onEditRef.current = onEdit;
    const onDeleteRef = useRef(onDelete);
    onDeleteRef.current = onDelete;

    const columnDefs = useMemo(
        () => [
            {
                headerName: 'Key',
                field: 'key' as const,
                flex: 1,
                pinned: 'left' as const,
                sortable: true,
                cellRenderer: AttributeKeyCell,
                filterParams: DefaultTextFilterParams,
            },
            {
                headerName: 'Value',
                field: 'value' as const,
                flex: 1,
                cellRenderer: AttributeCell,
                filterParams: DefaultTextFilterParams,
            },
            ...(canManage
                ? [
                      {
                          headerName: '',
                          colId: 'actions',
                          width: 190,
                          flex: 0,
                          sortable: false,
                          filter: false,
                          floatingFilter: false,
                          cellRenderer: (params: ICellRendererParams<AccountAttribute>) => (
                              <ActionCell
                                  actions={[
                                      {
                                          label: 'Edit',
                                          icon: 'edit',
                                          variant: 'neutral',
                                          disabled: busy,
                                          onClick: () => params.data && onEditRef.current?.(params.data),
                                      },
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

    return <RegularTable columnDefs={columnDefs} tableRef={tableRef} rowData={attributes} />;
};
