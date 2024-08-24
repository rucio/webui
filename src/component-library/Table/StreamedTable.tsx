import React, {useEffect} from "react";
import {RegularTable, RegularTableProps} from "@/component-library/Table/RegularTable";
import {UseChunkedStream} from "@/lib/infrastructure/hooks/useChunkedStream";
import {NoLoadedRowsOverlay} from "@/component-library/Table/Overlays/NoLoadedRowsOverlay";

export interface StreamedTableProps extends RegularTableProps {
    streamingHook: UseChunkedStream<any>
}

export const StreamedTable = (props: StreamedTableProps) => {
    // Ensure the overlay updates when streaming faces an error
    useEffect(() => {
        if (props.tableRef.current?.api) {
            props.tableRef.current!.api.showNoRowsOverlay();
        }
    }, [props.streamingHook.error]);

    const getDefaultNoRowsElement = (gridProps: any) => {
        return <NoLoadedRowsOverlay error={props.streamingHook.error} {...gridProps}/>
    }

    return <RegularTable
        tableRef={props.tableRef}
        columnDefs={props.columnDefs}
        noRowsOverlayComponent={props.noRowsOverlayComponent ?? getDefaultNoRowsElement}
    />
}