import React, { useRef, useState } from 'react';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { DIDViewModel } from '@/lib/infrastructure/data/view-model/did';
import { GridReadyEvent, SelectionChangedEvent, ValueGetterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';

type ListDIDTableProps = {
    streamingHook: UseStreamReader<DIDViewModel>;
    onSelectionChanged: (event: SelectionChangedEvent) => void;
    onGridReady: (event: GridReadyEvent) => void;
};

export const ListDIDTable = (props: ListDIDTableProps) => {
    const tableRef = useRef<AgGridReact<DIDViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'Identifier',
            valueGetter: (params: ValueGetterParams<DIDViewModel>) => {
                return params.data?.scope + ':' + params.data?.name;
            },
            flex: 1,
            minWidth: 250,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
    ]);

    return <StreamedTable columnDefs={columnDefs} rowSelection={{ mode: 'singleRow', enableClickSelection: true }} tableRef={tableRef} {...props} />;
};
