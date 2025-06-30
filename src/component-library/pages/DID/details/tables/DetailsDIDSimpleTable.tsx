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

type DetailsDIDSimpleTableProps = {
    streamingHook: UseStreamReader<DIDViewModel>;
    onSelectionChanged?: (event: SelectionChangedEvent) => void;
    onGridReady: (event: GridReadyEvent) => void;
};

const ClickableDID = (props: { value: string[] }) => {
    const [scope, name] = props.value;
    return (
        <ClickableCell href={`/did/page/${encodeURIComponent(scope)}/${encodeURIComponent(name)}`}>
            {scope}:{name}
        </ClickableCell>
    );
};

export const DetailsDIDSimpleTable = (props: DetailsDIDSimpleTableProps) => {
    const tableRef = useRef<AgGridReact<DIDViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'Identifier',
            flex: 1,
            valueGetter: (params: ValueGetterParams<ListDIDsViewModel>) => {
                return [params.data?.scope, params.data?.name];
            },
            cellRenderer: ClickableDID,
            minWidth: 250,
            sortable: false,
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
            sortable: false,
        },
    ]);

    return <StreamedTable columnDefs={columnDefs} rowSelection={props.onSelectionChanged ? 'single' : undefined} tableRef={tableRef} {...props} />;
};
