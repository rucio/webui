import {RefObject, useEffect, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import {UseChunkedStream} from "@/lib/infrastructure/hooks/useChunkedStream";
import {RSEViewModel} from "@/lib/infrastructure/data/view-model/rse";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {twMerge} from "tailwind-merge";

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

    useEffect(() => {
        const handleResize = () => {
            if (props.tableRef.current?.api) {
                props.tableRef.current!.api.sizeColumnsToFit();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [props.tableRef]);

    return <div className={twMerge(
        "ag-theme-alpine",
        "grid grow"
    )}>
        <AgGridReact
            pagination={true}
            paginationAutoPageSize={true}
            ref={props.tableRef}
            columnDefs={columnDefs}
            onGridReady={(params) => {
                params.api.sizeColumnsToFit(); // Ensures columns stretch to fit grid width
            }}
            domLayout="normal" // Ensures the grid fits within the flex container
        />
    </div>
}