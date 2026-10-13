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
    /** Show the Delete action (admins with accounts.manage). */
    canManage: boolean;
    onDelete?: (attribute: AccountAttribute) => void;
}

/** Account attributes, modelled on DetailsRSEAttributesTable, plus a Delete action. */
export const AccountAttributesTable = ({ attributes, canManage, onDelete }: AccountAttributesTableProps) => {
    const tableRef = useRef<AgGridReact<AccountAttribute>>(null);
    // Keep the column definitions stable while the callback changes identity on every render.
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
                          width: 110,
                          flex: 0,
                          sortable: false,
                          filter: false,
                          floatingFilter: false,
                          cellRenderer: (params: ICellRendererParams<AccountAttribute>) => (
                              <ActionCell
                                  actions={[
                                      {
                                          label: 'Delete',
                                          icon: 'delete',
                                          variant: 'error',
                                          onClick: () => params.data && onDeleteRef.current?.(params.data),
                                      },
                                  ]}
                              />
                          ),
                      },
                  ]
                : []),
        ],
        [canManage],
    );

    return <RegularTable columnDefs={columnDefs} tableRef={tableRef} rowData={attributes} />;
};
