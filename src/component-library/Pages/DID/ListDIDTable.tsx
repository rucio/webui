import React, {RefObject, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import {UseChunkedStream} from "@/lib/infrastructure/hooks/useChunkedStream";
import {StreamedTable} from "@/component-library/Table/StreamedTable";
import {DefaultTextFilterParams} from "@/component-library/Table/FilterParameters/DefaultTextFilterParams";
import {DIDViewModel} from "@/lib/infrastructure/data/view-model/did";
import {SelectionChangedEvent, ValueGetterParams} from "ag-grid-community";

type ListDIDTableProps = {
    tableRef: RefObject<AgGridReact>
    streamingHook: UseChunkedStream<DIDViewModel>
    onSelectionChanged: (event: SelectionChangedEvent) => void,
}

export const ListDIDTable = (props: ListDIDTableProps) => {
    const [columnDefs] = useState([
        {
            headerName: 'Name',
            valueGetter: (params: ValueGetterParams<DIDViewModel>) => {
                return params.data?.scope + ':' + params.data?.name;
            },
            flex: 4,
            minWidth: 250,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
    ]);

    return <StreamedTable columnDefs={columnDefs} rowSelection="single" {...props}/>
}