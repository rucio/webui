import React, {RefObject, useEffect, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import {StreamingError, StreamingErrorType, UseChunkedStream} from "@/lib/infrastructure/hooks/useChunkedStream";
import {RSEViewModel} from "@/lib/infrastructure/data/view-model/rse";
import '@/component-library/ag-grid-theme-rucio.css';
import {twMerge} from "tailwind-merge";
import Link from "next/link";
import {IFilterOptionDef, ITextFilterParams} from "ag-grid-community";
import {HiCheck, HiChevronLeft, HiChevronRight, HiExternalLink} from "react-icons/hi";
import {Skeleton} from "@/component-library/ui/skeleton";
import {LoadingSpinner} from "@/component-library/ui/loading-spinner";

type ListRSETableProps = {
    tableRef: RefObject<AgGridReact>
    streamingHook: UseChunkedStream<RSEViewModel>
}

// TODO: move to a different file

const LoadingTableOverlay = () => {
    return <div className="text-neutral-100">Click <b>Search</b></div>
};

const NoRowsOverlay = (props: { error?: StreamingError }) => {
    // TODO: add icons
    if (props.error) {
        if (props.error.type === StreamingErrorType.NOT_FOUND) {
            return <div className="text-neutral-100">Nothing found</div>;
        } else if (props.error.type !== StreamingErrorType.BAD_METHOD_CALL) {
            return <div className="text-neutral-100">An <b>error</b> has happened</div>;
        }
    }
    return <LoadingSpinner/>;
}

// TODO: decompose this to a different file as well
const ClickableCell = (props: { href: string, children: React.ReactNode }) => {
    return (
        <Link href={props.href}>
            <div>
                {props.children}
                <HiExternalLink className="text-neutral-100 text-2xl pl-2 inline"/>
            </div>
        </Link>
    );
}

const ClickableName = (props: { value: string }) => {
    return <ClickableCell href={`/rse/page/${props.value}`}>
        {props.value}
    </ClickableCell>
};

const BadgeCell = (props: { value: string, colorClass: string }) => {
    return <div className={twMerge(
        "text-neutral-100",
        "rounded",
        "inline grow",
        "px-3 m-2",
        "content-center text-center",
        "bg-opacity-50",
        props.colorClass
    )}>
        {props.value}
    </div>;
}

const badgeCellWrapperStyle = {
    display: 'flex'
};

const typeColorClasses: Record<string, string> = {
    'DISK': 'bg-base-info-500',
    'TAPE': 'bg-extra-rose-500',
    'UNKNOWN': 'bg-base-warning-400',
}

const TypeBadge = (props: { value: string }) => {
    return <BadgeCell value={props.value} colorClass={typeColorClasses[props.value]}/>
}

const CheckboxCell = (props: { value: string }) => {
    return <div className={twMerge(
        "flex justify-center items-center",
        "h-5 w-5",
        "rounded",
        "text-center",
        props.value ? "bg-base-success-600 bg-opacity-60" : "bg-neutral-900 border-solid border border-neutral-100 border-opacity-20"
    )}>
        {props.value && <HiCheck className="text-neutral-100 text"/>}
    </div>
}

const checkboxCellWrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const DefaultTextFilterParams: ITextFilterParams = {
    filterOptions: ['contains'],
    buttons: ['reset'],
    maxNumConditions: 1,
};

const DefaultBooleanFilterParams: ITextFilterParams = {
    filterOptions: [
        'empty',
        {
            numberOfInputs: 0,
            displayKey: 'true',
            displayName: 'True',
            predicate: (_: any[], cellValue: any) => cellValue
        },
        {
            numberOfInputs: 0,
            displayKey: 'false',
            displayName: 'False',
            predicate: (_: any[], cellValue: any) => !cellValue
        }
    ],
    buttons: ['reset'],
};

const buildDiscreteFilterParams = (values: string[]): ITextFilterParams => {
    return {
        filterOptions: [
            'empty',
            ...values.map((value) => {
                return {
                    numberOfInputs: 0,
                    displayKey: value.toLowerCase(),
                    displayName: value,
                    predicate: (_: any[], cellValue: any) => cellValue === value
                } as IFilterOptionDef;
            })
        ],
        maxNumConditions: 1,
        buttons: ['reset']
    };
};

const CustomPaginationPanel = (props: {
    currentPageRef: RefObject<HTMLSpanElement>,
    totalPagesRef: RefObject<HTMLSpanElement>,
    previousPageRef: RefObject<HTMLButtonElement>,
    nextPageRef: RefObject<HTMLButtonElement>,
    containerRef: RefObject<HTMLDivElement>
}) => {
    return <div ref={props.containerRef} className={twMerge(
        "flex items-center justify-center",
        "text-neutral-100",
        "py-1",
        "invisible"
    )}>
        <button
            disabled={true}
            ref={props.previousPageRef}
            className="disabled:text-neutral-600 text-neutral-100 text-xl"
        >
            <HiChevronLeft/>
        </button>
        <span className="px-3">
            Page <span ref={props.currentPageRef}>0</span> of <span ref={props.totalPagesRef}>0</span>
        </span>
        <button
            disabled={true}
            ref={props.nextPageRef}
            className="disabled:text-neutral-600 text-neutral-100 text-xl"
        >
            <HiChevronRight/>
        </button>
    </div>
};


// TODO: decompose into a generic table component
export const ListRSETable = (props: ListRSETableProps) => {
    const [columnDefs] = useState([
        {
            headerName: 'Name',
            field: 'name',
            flex: 4,
            minWidth: 250,
            cellRenderer: ClickableName,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Type',
            field: 'rse_type',
            flex: 1,
            minWidth: 125,
            maxWidth: 200,
            cellStyle: badgeCellWrapperStyle,
            cellRenderer: TypeBadge,
            filter: true,
            sortable: false,
            filterParams: buildDiscreteFilterParams([
                'DISK',
                'TAPE',
                'UNKNOWN'
            ])
        },
        {
            headerName: 'Volatile',
            field: 'volatile',
            flex: 1,
            maxWidth: 175,
            minWidth: 125,
            cellStyle: checkboxCellWrapperStyle,
            cellRenderer: CheckboxCell,
            sortable: false,
            filter: true,
            filterParams: DefaultBooleanFilterParams
        },
        {
            headerName: 'Deterministic',
            field: 'deterministic',
            flex: 1,
            maxWidth: 200,
            minWidth: 175,
            cellStyle: checkboxCellWrapperStyle,
            cellRenderer: CheckboxCell,
            sortable: false,
            filter: true,
            filterParams: DefaultBooleanFilterParams,
        },
        {
            headerName: 'Staging',
            field: 'staging_area',
            flex: 1,
            maxWidth: 175,
            minWidth: 125,
            cellStyle: checkboxCellWrapperStyle,
            cellRenderer: CheckboxCell,
            sortable: false,
            filter: true,
            filterParams: DefaultBooleanFilterParams
        },
    ]);

    const currentPageRef = useRef<HTMLSpanElement>(null);
    const totalPagesRef = useRef<HTMLSpanElement>(null);
    const previousPageRef = useRef<HTMLButtonElement>(null);
    const nextPageRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isTableLoaded, setIsTableLoaded] = useState<boolean>(false);

    // Ensure the overlay updates when streaming faces an error
    useEffect(() => {
        if (props.tableRef.current?.api) {
            props.tableRef.current!.api.showNoRowsOverlay();
        }
    }, [props.streamingHook.error]);

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
            containerRef.current!.style.visibility = totalPages === 0 ? 'hidden' : 'visible';

            // Pages are zero based, therefore +1
            const currentPage = gridApi.paginationGetCurrentPage() + 1;
            currentPageRef.current!.textContent = currentPage.toString();

            previousPageRef.current!.disabled = currentPage === 1;
            previousPageRef.current!.onclick = onPreviousPage;

            nextPageRef.current!.disabled = currentPage === totalPages;
            nextPageRef.current!.onclick = onNextPage;
        }
    };

    return <>
        <div className={twMerge(
            "ag-theme-custom",
            "grid grow w-full",
            "relative"
        )}>
            <Skeleton className="absolute flex items-center justify-center w-full h-full"/>
            <AgGridReact
                pagination={true}
                paginationAutoPageSize={true}
                ref={props.tableRef}
                loadingOverlayComponent={LoadingTableOverlay}
                noRowsOverlayComponent={(gridProps: any) => <NoRowsOverlay
                    error={props.streamingHook.error} {...gridProps}/>}
                columnDefs={columnDefs}
                onGridReady={(params) => {
                    setIsTableLoaded(true);
                    params.api.sizeColumnsToFit(); // Ensures columns stretch to fit grid width
                }}
                domLayout="normal" // Ensures the grid fits within the flex container
                suppressPaginationPanel={true}
                onPaginationChanged={onPaginationChanged}
            />
        </div>
        <CustomPaginationPanel
            currentPageRef={currentPageRef}
            totalPagesRef={totalPagesRef}
            nextPageRef={nextPageRef}
            previousPageRef={previousPageRef}
            containerRef={containerRef}
        />
    </>
}