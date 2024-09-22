import React, { RefObject, useEffect, useRef, useState } from 'react';
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { twMerge } from 'tailwind-merge';
import { Skeleton } from '@/component-library/atoms/loading/Skeleton';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import { NoDataYetOverlay } from '@/component-library/features/table/overlays/NoDataYetOverlay';
import { AgGridEvent, GridReadyEvent } from 'ag-grid-community';
import useDarkMode from '@/lib/infrastructure/hooks/useDarkMode';
import '@/component-library/features/table/RegularTable/styles/agGridThemeRucioDark.css';
import '@/component-library/features/table/RegularTable/styles/agGridThemeRucioLight.css';

export interface RegularTableProps extends AgGridReactProps {
    tableRef: RefObject<AgGridReact>;
}

// This implementation of the pagination panel uses refs to prevent excessive state updates
/**
 * A component for flexible and responsive pagination of the table
 */
export const SimplePaginationPanel = (props: {
    currentPageRef: RefObject<HTMLSpanElement>;
    totalPagesRef: RefObject<HTMLSpanElement>;
    previousPageRef: RefObject<HTMLButtonElement>;
    nextPageRef: RefObject<HTMLButtonElement>;
    lastPageRef: RefObject<HTMLButtonElement>;
    firstPageRef: RefObject<HTMLButtonElement>;
    containerRef: RefObject<HTMLDivElement>;
}) => {
    const enabledTextClasses = 'text-neutral-800 dark:text-neutral-100';
    const disabledTextClasses = 'disabled:text-neutral-400 disabled:dark:text-neutral-500';
    const buttonClasses = twMerge('text-l', 'px-1', enabledTextClasses, disabledTextClasses);

    return (
        <div
            className={twMerge(
                'flex items-center justify-center',
                enabledTextClasses,
                'py-2 !m-0',
                'bg-neutral-200 dark:bg-neutral-700',
                'border border-solid',
                'border-neutral-900 dark:border-neutral-100',
                'border-opacity-10 dark:border-opacity-10',
                'rounded-b-md',
            )}
        >
            <div className="flex justify-center invisible" ref={props.containerRef}>
                <button disabled={true} ref={props.firstPageRef} className={buttonClasses}>
                    <HiOutlineChevronDoubleLeft />
                </button>
                <button disabled={true} ref={props.previousPageRef} className={buttonClasses}>
                    <HiOutlineChevronLeft />
                </button>
                <span className="px-3">
                    Page <span ref={props.currentPageRef}>0</span> of <span ref={props.totalPagesRef}>0</span>
                </span>
                <button disabled={true} ref={props.nextPageRef} className={buttonClasses}>
                    <HiOutlineChevronRight />
                </button>
                <button disabled={true} ref={props.lastPageRef} className={buttonClasses}>
                    <HiOutlineChevronDoubleRight />
                </button>
            </div>
        </div>
    );
};

export const RegularTable = (props: RegularTableProps) => {
    // Refs for controlling the pagination panel
    const currentPageRef = useRef<HTMLSpanElement>(null);
    const totalPagesRef = useRef<HTMLSpanElement>(null);
    const previousPageRef = useRef<HTMLButtonElement>(null);
    const nextPageRef = useRef<HTMLButtonElement>(null);
    const firstPageRef = useRef<HTMLButtonElement>(null);
    const lastPageRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const onNextPage = () => {
        const gridApi = props.tableRef.current?.api;
        gridApi?.paginationGoToNextPage();
    };

    const onPreviousPage = () => {
        const gridApi = props.tableRef.current?.api;
        gridApi?.paginationGoToPreviousPage();
    };

    const onFirstPage = () => {
        const gridApi = props.tableRef.current?.api;
        gridApi?.paginationGoToFirstPage();
    };

    const onLastPage = () => {
        const gridApi = props.tableRef.current?.api;
        gridApi?.paginationGoToLastPage();
    };

    const onPaginationChanged = () => {
        const gridApi = props.tableRef.current?.api;
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
            firstPageRef.current!.disabled = currentPage === 1;
            previousPageRef.current!.onclick = onPreviousPage;
            firstPageRef.current!.onclick = onFirstPage;

            nextPageRef.current!.disabled = currentPage === totalPages;
            lastPageRef.current!.disabled = currentPage === totalPages;
            nextPageRef.current!.onclick = onNextPage;
            lastPageRef.current!.onclick = onLastPage;
        }
    };

    // Whether the table component is ready to be displayed
    const [isTableLoaded, setIsTableLoaded] = useState<boolean>(false);

    const onGridReady = (event: GridReadyEvent) => {
        setIsTableLoaded(true);
        event.api.sizeColumnsToFit(); // Ensures columns stretch to fit grid width

        if (props.onGridReady) {
            props.onGridReady(event);
        }
    };

    useEffect(() => {
        onPaginationChanged();
    }, [isTableLoaded]);

    const handleResize = (event: AgGridEvent) => {
        event.api.sizeColumnsToFit();
    };

    const isDarkMode = useDarkMode();

    /* loadingOverlayComponent is shown when the loading hasn't begun yet,
        whereas noRowsOverlayComponent is shown when the loading has started without data transactions */
    return (
        <>
            <div
                className={twMerge(
                    isDarkMode ? 'ag-grid-theme-rucio-dark' : 'ag-grid-theme-rucio-light',
                    'grid grow w-full',
                    'relative',
                    'min-h-[300px]',
                )}
            >
                {!isTableLoaded && <Skeleton className="absolute flex items-center justify-center w-full h-full rounded-b-none" />}
                <AgGridReact
                    {...props}
                    pagination={true}
                    paginationAutoPageSize={true}
                    ref={props.tableRef}
                    loadingOverlayComponent={NoDataYetOverlay}
                    onGridReady={onGridReady}
                    domLayout="normal" // Ensures the grid fits within the flex container
                    suppressPaginationPanel={true}
                    onPaginationChanged={onPaginationChanged}
                    suppressMovableColumns={true}
                    rowMultiSelectWithClick={true}
                    onGridSizeChanged={handleResize}
                    //asyncTransactionWaitMillis={500}
                />
            </div>
            <SimplePaginationPanel
                currentPageRef={currentPageRef}
                totalPagesRef={totalPagesRef}
                nextPageRef={nextPageRef}
                previousPageRef={previousPageRef}
                containerRef={containerRef}
                firstPageRef={firstPageRef}
                lastPageRef={lastPageRef}
            />
        </>
    );
};
