import {RefObject, useEffect, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import {UseChunkedStream} from "@/lib/infrastructure/hooks/useChunkedStream";
import {RSEViewModel} from "@/lib/infrastructure/data/view-model/rse";
import '@/component-library/ag-grid-theme-rucio.css';
import {twMerge} from "tailwind-merge";

type ListRSETableProps = {
    tableRef: RefObject<AgGridReact>
    streamingHook: UseChunkedStream<RSEViewModel>
}

export const ListRSETable = (props: ListRSETableProps) => {
    // TODO: implement custom filter for discrete/boolean values
    // TODO: implement styled badges for the values
    const [columnDefs] = useState([
        {headerName: 'Name', field: 'name', filter: true, flex: 3, minWidth: 250},
        {headerName: 'Type', field: 'rse_type', flex: 2, minWidth: 125},
        {headerName: 'Volatile', field: 'volatile', flex: 1, maxWidth: 175, minWidth: 125},
        {headerName: 'Deterministic', field: 'deterministic', flex: 1, maxWidth: 175, minWidth: 150},
        {headerName: 'Staging', field: 'staging_area', flex: 1, maxWidth: 175, minWidth: 125},
    ]);

    useEffect(() => {
        // TODO: don't resize if the screen is too small
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

    // TODO: custom pagination component on small screens
    return <div className={twMerge(
        "ag-theme-custom",
        "grid grow w-full"
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