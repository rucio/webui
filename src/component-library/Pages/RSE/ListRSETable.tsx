import {RefObject, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import {UseChunkedStream} from "@/lib/infrastructure/hooks/useChunkedStream";
import {RSEViewModel} from "@/lib/infrastructure/data/view-model/rse";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

type ListRSETableProps = {
    tableRef: RefObject<AgGridReact>
    streamingHook: UseChunkedStream<RSEViewModel>
}

export const ListRSETable = (props: ListRSETableProps) => {
    const [columnDefs] = useState([
        {headerName: 'Name', field: 'name'},
        {headerName: 'Type', field: 'rse_type'},
        {headerName: 'Volatile', field: 'volatile'},
        {headerName: 'Deterministic', field: 'deterministic'},
        {headerName: 'Staging', field: 'staging_area'},
    ]);

    return <div className="ag-theme-alpine" style={{height: 400, width: 600}}>
        <AgGridReact
            ref={props.tableRef}
            columnDefs={columnDefs}
        />
    </div>
}