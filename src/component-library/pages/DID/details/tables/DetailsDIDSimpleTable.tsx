import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { DIDViewModel } from '@/lib/infrastructure/data/view-model/did';
import { GridReadyEvent, SelectionChangedEvent, ValueGetterParams } from 'ag-grid-community';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';
import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { DIDTypeBadge } from '@/component-library/features/badges/DID/DIDTypeBadge';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { DIDType } from '@/lib/core/entity/rucio';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { AgGridMultiSelectFilter, createMultiSelectFilterHandler } from '@/component-library/features/table/filters/AgGridMultiSelectFilter';

type DetailsDIDSimpleTableProps = {
    streamingHook: UseStreamReader<DIDViewModel>;
    onSelectionChanged?: (event: SelectionChangedEvent) => void;
    onGridReady: (event: GridReadyEvent) => void;
    isActive?: boolean;
};

const ClickableDID = (props: { value: string[] }) => {
    const [scope, name] = props.value;
    return (
        <ClickableCell href={`/did/${encodeURIComponent(scope)}/${encodeURIComponent(name)}`}>
            {scope}:{name}
        </ClickableCell>
    );
};

export const DetailsDIDSimpleTable = (props: DetailsDIDSimpleTableProps) => {
    const tableRef = useRef<AgGridReact<DIDViewModel>>(null);

    const didTypeOptions = Object.values(DIDType).filter(value => value !== DIDType.ALL);

    const [columnDefs] = useState([
        {
            headerName: 'Identifier',
            flex: 1,
            valueGetter: (params: ValueGetterParams<ListDIDsViewModel>) => {
                return [params.data?.scope, params.data?.name];
            },
            cellRenderer: ClickableDID,
            minWidth: 450,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Type',
            field: 'did_type',
            cellRenderer: DIDTypeBadge,
            minWidth: 180,
            cellStyle: badgeCellWrapperStyle,
            cellRendererParams: {
                className: badgeCellClasses,
            },
            filter: {
                component: AgGridMultiSelectFilter,
                handler: createMultiSelectFilterHandler(didTypeOptions),
            },
            filterParams: {
                options: didTypeOptions,
            },
        },
    ]);

    return (
        <StreamedTable
            columnDefs={columnDefs}
            rowSelection={props.onSelectionChanged ? { mode: 'singleRow', enableClickSelection: true } : undefined}
            tableRef={tableRef}
            {...props}
            enableFilterHandlers
        />
    );
};
