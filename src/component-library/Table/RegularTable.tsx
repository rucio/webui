import React, {RefObject, useEffect, useRef, useState} from "react";
import {twMerge} from "tailwind-merge";
import {Skeleton} from "@/component-library/ui/skeleton";
import {AgGridReact} from "ag-grid-react";
import {ColDef, ColGroupDef} from "ag-grid-community/dist/types/core/entities/colDef";
import {NoDataYetOverlay} from "@/component-library/Table/Overlays/NoDataYetOverlay";
import {GridReadyEvent, SelectionChangedEvent} from "ag-grid-community";
import {SimplePaginationPanel} from "@/component-library/Table/PaginationPanels/SimplePaginationPanel";
import '@/component-library/ag-grid-theme.css';

export interface RegularTableProps {
    tableRef: RefObject<AgGridReact>,
    columnDefs: (ColDef | ColGroupDef)[],
    noRowsOverlayComponent?: any,
    rowSelection?: 'single' | 'multiple',
    onSelectionChanged?: (event: SelectionChangedEvent) => void,
}

export const RegularTable = (props: RegularTableProps) => {
    // Refs for controlling the pagination panel
    const currentPageRef = useRef<HTMLSpanElement>(null);
    const totalPagesRef = useRef<HTMLSpanElement>(null);
    const previousPageRef = useRef<HTMLButtonElement>(null);
    const nextPageRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const onNextPage = () => {
        const gridApi = props.tableRef.current!.api;
        if (gridApi) {
            gridApi.paginationGoToNextPage();
        }
    }

    const onPreviousPage = () => {
        const gridApi = props.tableRef.current!.api;
        if (gridApi) {
            gridApi.paginationGoToPreviousPage();
        }
    }

    const onPaginationChanged = () => {
        const gridApi = props.tableRef.current!.api;
        // Make sure the table is loaded before updating the pagination component to avoid flickering
        if (isTableLoaded && gridApi) {
            const totalPages = gridApi.paginationGetTotalPages();
            totalPagesRef.current!.textContent = totalPages.toString();
            // Ensure visibility of the pagination panel only after some data is loaded
            containerRef.current!.style.visibility = totalPages === 0 ? 'hidden' : 'visible';

            // Pages are zero based, hence the +1
            const currentPage = gridApi.paginationGetCurrentPage() + 1;
            currentPageRef.current!.textContent = currentPage.toString();

            previousPageRef.current!.disabled = currentPage === 1;
            previousPageRef.current!.onclick = onPreviousPage;

            nextPageRef.current!.disabled = currentPage === totalPages;
            nextPageRef.current!.onclick = onNextPage;
        }
    };

    // Whether the table component is ready to be displayed
    const [isTableLoaded, setIsTableLoaded] = useState<boolean>(false);

    const onGridReady = (event: GridReadyEvent) => {
        setIsTableLoaded(true);
        event.api.sizeColumnsToFit(); // Ensures columns stretch to fit grid width
    }

    // Resize the columns to fit the grid on changing the window dimensions
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

    /* loadingOverlayComponent is shown when the loading hasn't begun yet,
        whereas noRowsOverlayComponent is shown when the loading has started without data transactions */
    return <>
        <div className={twMerge(
            "ag-theme-custom",
            "grid grow w-full",
            "relative"
        )}>
            {!isTableLoaded && <Skeleton className="absolute flex items-center justify-center w-full h-full"/>}
            <AgGridReact
                pagination={true}
                paginationAutoPageSize={true}
                ref={props.tableRef}
                loadingOverlayComponent={NoDataYetOverlay}
                noRowsOverlayComponent={props.noRowsOverlayComponent}
                columnDefs={props.columnDefs}
                onGridReady={onGridReady}
                domLayout="normal" // Ensures the grid fits within the flex container
                suppressPaginationPanel={true}
                onPaginationChanged={onPaginationChanged}
                suppressMovableColumns={true}
                rowSelection={props.rowSelection}
                onSelectionChanged={props.onSelectionChanged}
                //asyncTransactionWaitMillis={500}
            />
        </div>
        <SimplePaginationPanel
            currentPageRef={currentPageRef}
            totalPagesRef={totalPagesRef}
            nextPageRef={nextPageRef}
            previousPageRef={previousPageRef}
            containerRef={containerRef}
        />
    </>
}