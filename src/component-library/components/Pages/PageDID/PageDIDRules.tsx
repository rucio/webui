// components
import { H3 } from "../../Text/Headings/H3";
import { Filter } from "../../StreamedTables/Filter";
import { FetchstatusIndicator } from "../../StreamedTables/FetchstatusIndicator";
import { PaginationDiv } from "../../StreamedTables/PaginationDiv";

import { HiChevronDoubleLeft, HiChevronLeft, HiChevronRight, HiChevronDoubleRight, HiSearch, HiCheck, HiDotsHorizontal, HiExternalLink, HiSortAscending, HiSortDescending } from "react-icons/hi"
import { TableData } from "@/lib/infrastructure/data/view-model/streamedtables";
import { DIDRules } from "@/lib/infrastructure/data/view-model/page-did";
import { createColumnHelper, useReactTable, TableOptions, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, Column, flexRender } from "@tanstack/react-table"
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { RuleStateTag } from "../../Tags/RuleStateTag";
import { DateTag } from "../../Tags/DateTag";
import { RuleState } from "@/lib/core/entity/rucio";
import { StyleMetaColumnDef } from "@/lib/infrastructure/data/view-model/streamedtables";
import { FullFilter } from "../../StreamedTables/FullFilter";

export const PageDIDRules = (
    props: {
        tableData: TableData<DIDRules>
    }
) => {
    const tableData = props.tableData
    const columnHelper = createColumnHelper<DIDRules>()
    const columns: any[] = [
        columnHelper.accessor("id", {
            id: "id",
        }),
        columnHelper.accessor("name", {
            id: "Rule",
            cell: (info) => {
                return (
                    <span
                        className={twMerge(
                            "flex flex-row space-x-2"
                        )}
                    >
                        <span
                            className={twMerge("break-all pl-1 dark:text-white")}
                        >
                            {info.getValue()}
                        </span>
                        <RuleStateTag
                            state={info.row.original.state}
                            tiny
                            className={windowSize[0] > 1024 ? "hidden" : ""}
                        />
                    </span>
                )
            },
            header: (info) => {
                return (<p>should never be visible</p>)
            },
            meta: {
                style: "pl-1",
                filter: true
            },
        }),
        columnHelper.accessor("state", {
            id: "state",
            cell: (info) => {
                return (
                    <RuleStateTag state={info.getValue()} />
                )
            },
            header: (info) => {
                return (
                    <span
                        className={twMerge(
                            "flex flex-col md:flex-row justify-between items-center pr-1 space-y-1 md:pr-2",
                        )}
                        onClick={(e) => {
                            // create a match statement for the state filter
                            const filterchange = (filterState: RuleState | null) => {
                                setFilterState(filterState)
                                var column = table.getColumn("state") as Column<DIDRules, unknown>
                                column.setFilterValue(filterState ?? "")
                            }
                            const nextRecord = {
                                "null": "Replicating",
                                "Replicating": "OK",
                                "OK": "Stuck",
                                "Stuck": "Suspended",
                                "Suspended": "Waiting_Approval",
                                "Waiting_Approval": "Inject",
                                "Inject": null,
                            }
                            filterchange(nextRecord[filterState ?? "null"] as RuleState | null)
                        }}
                    >
                        <H3>State</H3>
                        <span className="h-6">
                            {
                                filterState === null ?
                                    <HiDotsHorizontal
                                        className="text-xl text-gray-500 dark:text-gray-200"
                                    /> :
                                    <RuleStateTag
                                        state={filterState}
                                        tiny
                                    />
                            }
                        </span>
                    </span>
                )
            },
            meta: {
                style: "w-28 md:w-44 cursor-pointer select-none",
            },
        }),
        columnHelper.accessor("account", {
            id: "Account",
            cell: (info) => {
                return (
                    <p
                        className={twMerge("break-all pl-1 dark:text-white")}
                    >
                        {info.getValue()}
                    </p>
                )
            },
            header: (info) => {
                return (<p>should never be visible</p>)
            },
            meta: {
                style: "pl-1",
                filter: true
            },
        }),
        columnHelper.accessor("subscription", {
            id: "subscription",
            cell: (info) => {
                return (
                    <p
                        className={twMerge("break-all pl-1 dark:text-white")}
                    >
                        {info.getValue().name}
                    </p>
                )
            },
            header: (info) => {
                return (
                    <H3>Subscription</H3>
                )
            },
            meta: {
                style: "",
            },
        }),
        columnHelper.accessor("last_modified", {
            id: "last_modified",
            cell: (info) => {
                return (
                    <DateTag date={info.getValue()} className="pl-1" />
                )
            },
            header: (info) => {
                return (
                    <span
                        className={twMerge(
                            "flex flex-col md:flex-row justify-between items-center pr-1 space-y-1 md:pr-2"
                        )}
                        onClick={(e) => {
                            // create a match statement for the state filter
                            const sortchange = (sortState: "asc" | "desc" | null) => {
                                setDateSorting(sortState)
                                var column = table.getColumn("last_modified") as Column<DIDRules, unknown>
                                column.toggleSorting()
                            }
                            const nextRecord = {
                                "null": "desc",
                                "desc": "asc",
                                "asc": null,
                            }
                            sortchange(nextRecord[dateSorting ?? "null"] as "asc" | "desc" | null)
                        }}
                    >
                        <H3>Last modified</H3>
                        <span className="h-6 text-gray-500 dark:text-gray-200 text-xl">
                            {
                                {
                                    asc: <HiSortAscending />, desc: <HiSortDescending />, "null": <HiDotsHorizontal />
                                }[dateSorting as string]
                            }
                        </span>
                    </span>
                )
            },
            meta: {
                style: "select-none cursor-pointer w-48",
            },
        }),
    ]

    // handle window resize
    const [windowSize, setWindowSize] = useState([
        1920, 1080
    ]);

    const table = useReactTable<DIDRules>({
        data: tableData.data || [],
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
        state: {
            columnVisibility: {
                id: false,
                Rule: true,
                state: windowSize[0] > 1024,
                Account: true,
                subscription: windowSize[0] > 1024,
                last_modified: windowSize[0] > 640,
            },
        }
    } as TableOptions<DIDRules>)

    // filtering and sorting
    const [filterState, setFilterState] = useState<RuleState | null>(null)
    const [dateSorting, setDateSorting] = useState<"asc" | "desc" | null>(null)


    useEffect(() => {
        setWindowSize([window.innerWidth, window.innerHeight])

        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    // Pagination
    const [pageIndex, setPageIndex] = useState(table.getState().pagination.pageIndex)
    useEffect(() => {
        setPageIndex(table.getState().pagination.pageIndex)
    }, [table.getState().pagination.pageIndex])
    useEffect(() => {
        table.setPageIndex(pageIndex)
    }, [pageIndex])
    useEffect(() => {
        table.setPageSize(tableData.pageSize)
    }, [tableData.pageSize])

    return (
        <div
            className={twMerge(
                "border dark:border-gray-200 dark:border-2 rounded-md",
                "flex flex-col justify-between space-y-2 pb-2",
                "bg-white dark:bg-gray-700",
                "h-fit min-h-[430px]",
                "relative",
                "min-w-0",
            )}
        >
            <table className="table-fixed w-full text-left">
                <thead className="w-full">
                    <tr
                        className={twMerge(
                            "w-full flex-row sticky top-0 bg-white dark:bg-gray-700 shadow-md dark:shadow-none h-16 sm:h-12"
                        )}
                    >
                        {
                            table.getLeafHeaders().map((header) => {
                                return (
                                    <th key={header.id} className={(header.column.columnDef as StyleMetaColumnDef<DIDRules>).meta.style}>
                                        {(header.column.columnDef as StyleMetaColumnDef<DIDRules>).meta.filter ?? false ? (
                                            <FullFilter columnTitle={header.column.id} column={header.column} table={table} />
                                        ) : (
                                            flexRender(header.column.columnDef.header, header.getContext())
                                        )}
                                    </th>
                                )
                            })
                        }
                    </tr>
                </thead>
                <tbody className="w-full">
                    {table.getRowModel().rows.map((row) => {
                        return (
                            <tr
                                key={row.id}
                                className={twMerge(
                                    "w-full hover:cursor-normal h-16 md:h-8",
                                    "bg-white odd:bg-stone-100",
                                    "dark:bg-gray-700 dark:odd:bg-gray-800",
                                    "hover:bg-gray-200 dark:hover:bg-gray-900",
                                )}
                            >
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <td
                                            key={cell.id}
                                            className={twMerge("")}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    }
                    )}
                </tbody>
            </table>
            <PaginationDiv table={table} pageIndex={pageIndex} setPageIndex={setPageIndex} />
            <div
                className={twMerge(
                    "absolute",
                    "top-16 sm:top-12 right-2",
                )}
            // DO WE NEED THIS?
            >
                <FetchstatusIndicator status={tableData.fetchStatus} />
            </div>
        </div>
    );
};
