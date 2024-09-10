import React, { useRef, useState } from 'react';
import { UseChunkedStream } from '@/lib/infrastructure/hooks/useChunkedStream';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { DefaultTextFilterParams } from '@/component-library/features/table/filter-parameters/DefaultTextFilterParams';
import { DIDViewModel } from '@/lib/infrastructure/data/view-model/did';
import { GridReadyEvent, SelectionChangedEvent, ValueGetterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

type ListDIDTableProps = {
    streamingHook: UseChunkedStream<DIDViewModel>;
    onSelectionChanged: (event: SelectionChangedEvent) => void;
    onGridReady: (event: GridReadyEvent) => void;
};

export const ListDIDTable = (props: ListDIDTableProps) => {
    const tableRef = useRef<AgGridReact<DIDViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'Name',
            valueGetter: (params: ValueGetterParams<DIDViewModel>) => {
                return params.data?.scope + ':' + params.data?.name;
            },
            minWidth: 250,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
    ]);

    return <StreamedTable columnDefs={columnDefs} rowSelection="single" tableRef={tableRef} {...props} />;
};
