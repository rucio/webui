import { FetchStatus } from "@tanstack/react-query";
import { FetchstatusIndicator } from "../../StreamedTables/FetchstatusIndicator";
import { twMerge } from "tailwind-merge";
import { useState, useEffect } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, TableOptions, useReactTable, Column } from "@tanstack/react-table";
import { DIDMeta } from "@/lib/core/entity/rucio";

import { Button } from "../../Button/Button";
import { P } from "../../Text/Content/P";
import { H3 } from "../../Text/Headings/H3";
import { Filter } from "../../StreamedTables/Filter";
import { NumInput } from "../../Input/NumInput";
import { HiChevronDoubleLeft, HiChevronLeft, HiChevronRight, HiChevronDoubleRight, HiSearch, HiCheck } from "react-icons/hi"
import { DIDTypeTag } from "../../Tags/DIDTypeTag";
import { PaginationDiv } from "../../StreamedTables/PaginationDiv";

export const DIDListTable = (
    props: {
        data: any,
        fetchstatus: FetchStatus,
        multipleDidTypes: boolean,
        pageSize: number,
        onSelect: (did: string) => void
    }
) => {
    const columnHelper = createColumnHelper<DIDMeta>()
    const columns: any[] = [
        columnHelper.accessor("name", {
            id: "name",
            cell: (info) => {
                return (
                    <p>
                        {info.row.original.scope + ":" + info.getValue()}
                    </p>
                )
            }
        }),
        columnHelper.accessor("scope", {
            id: "scope",
        }),
        columnHelper.accessor("did_type", {
            id: "did_type",
        }),
        columnHelper.accessor(row => `${row.scope}:${row.name}`, {
            id: "did",
            cell: (info) => {
                return (
                    <span
                        className={twMerge(
                            "flex flex-row justify-between md:justify-start md:space-x-4",
                            "pr-2"
                        )}
                    >
                        <p
                            className={twMerge(
                                "cursor-text fle w-fit break-all",
                                "font-mono dark:text-gray-200"
                            )}
                        >
                            {info.getValue()}
                        </p>
                        <DIDTypeTag
                            didtype={info.row.original.did_type}
                            className={twMerge(
                                props.multipleDidTypes ? "inline-block" : "hidden",
                            )}
                        />
                    </span>
                )
            }
        })
    ]

    const table = useReactTable<DIDMeta>({
        data: props.data || [],
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
        state: {
            columnVisibility: {
                name: false,
                scope: false,
                did: true,
                did_type: false
            }
        }
    } as TableOptions<DIDMeta>)

    // handle window resize
    const [windowSize, setWindowSize] = useState([
        1920, 1080
    ]);

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
    // using the window size to determine whether we shall show the input form with full width
    const [smallScreenNameFiltering, setSmallScreenNameFiltering] = useState(false)
    useEffect(() => {
        if (windowSize[0] > 640) {
            setSmallScreenNameFiltering(false)
        }
    }, [windowSize])

    const [selected, setSelected] = useState<string | null>(null)

    // Pagination
    const [pageIndex, setPageIndex] = useState(table.getState().pagination.pageIndex)
    useEffect(() => {
        setPageIndex(table.getState().pagination.pageIndex)
    }, [table.getState().pagination.pageIndex])
    useEffect(() => {
        table.setPageIndex(pageIndex)
    }, [pageIndex])
    useEffect(() => {
        table.setPageSize(props.pageSize)
    }, [props.pageSize])

    return (
        <div
            className={twMerge(
                "border dark:border-gray-200 dark:border-2 rounded-md",
                props.fetchstatus === "fetching" ? "hover:cursor-wait" : "",
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
                        <th className="pl-2 w-full">
                            <div className="flex flex-row items-center space-x-8 justify-between">
                                <span className="shrink-0">
                                    <H3>DID</H3>
                                </span>
                                <span className="hidden sm:flex w-full">
                                    <Filter column={table.getColumn("did") as Column<DIDMeta, unknown>} table={table} />
                                </span>
                                <span className="flex sm:hidden pr-4 relative">
                                    <button
                                        onClick={(e) => { setSmallScreenNameFiltering(!smallScreenNameFiltering) }}
                                    >
                                        <HiSearch className="text-xl text-gray-500 dark:text-gray-200" />
                                    </button>
                                </span>
                            </div>
                            <div
                                id="smallScreenNameFiltering"
                                className={twMerge(
                                    "absolute inset-0",
                                    smallScreenNameFiltering ? "flex" : "hidden",
                                    "bg-white",
                                    "p-2 flex-row justify-between space-x-2 items-center"
                                )}
                            >
                                <Filter column={table.getColumn("did") as Column<DIDMeta, unknown>} table={table} />
                                <button
                                    onClick={(e) => { setSmallScreenNameFiltering(!smallScreenNameFiltering) }}
                                >
                                    <HiCheck className="text-xl text-gray-500 dark:text-gray-200" />
                                </button>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody className="w-full" aria-label="DID Table Body">
                    {table.getRowModel().rows.map((row) => {
                        const did_scopename = row.original.scope + ":" + row.original.name
                        const isDIDSelected = selected === did_scopename
                        return (
                            <tr
                                key={row.id}
                                className={twMerge(
                                    "w-full hover:cursor-pointer h-16 md:h-8",
                                    "bg-white odd:bg-stone-100",
                                    "dark:bg-gray-700 dark:odd:bg-gray-800",
                                    isDIDSelected ? "bg-blue-200 odd:bg-blue-200 hover:bg-blue-300 dark:bg-blue-500 odd:dark:bg-blue-500 dark:hover:bg-blue-600 border border-blue-400 dark:border-blue-700" :
                                        "hover:bg-gray-200 dark:hover:bg-gray-900",
                                )}
                                onClick={(event) => {
                                    setSelected(did_scopename)
                                    props.onSelect(did_scopename)
                                }}
                                aria-rowindex={row.index}
                                aria-label="DID Table Row"
                            >
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <td
                                            key={cell.id}
                                            className={twMerge(
                                                "w-full pl-2",
                                            )}
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
            <PaginationDiv table={table}/>
            <div
                className={twMerge(
                    "absolute",
                    "top-16 sm:top-12 right-2",
                )}
            >
                <FetchstatusIndicator status={props.fetchstatus} />
            </div>
        </div>
    )
}