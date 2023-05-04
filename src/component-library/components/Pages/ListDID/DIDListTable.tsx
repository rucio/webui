import { FetchStatus } from "@tanstack/react-query";
import { FetchstatusIndicator } from "../../StreamedTables/FetchstatusIndicator";
import { twMerge } from "tailwind-merge";
import { useState, useEffect } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, TableOptions, useReactTable } from "@tanstack/react-table";
import { DIDMeta } from "@/lib/core/data/rucio-dto";

import { Button } from "../../Button/Button";
import { P } from "../../Text/Content/P";
import { NumInput } from "../../Input/NumInput";
import { HiChevronDoubleLeft, HiChevronLeft, HiChevronRight, HiChevronDoubleRight } from "react-icons/hi"

export const DIDListTable = (
    props: {
        data: any,
        fetchstatus: FetchStatus
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
        state: { columnVisibility: { name: true, scope: false } }
    } as TableOptions<DIDMeta>)

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
                "border dark:border-2 rounded-md",
                props.fetchstatus === "fetching" ? "hover:cursor-wait" : "",
                "flex flex-col justify-between space-y-2 pb-2",
                "bg-white dark:bg-gray-700",
                "h-fit min-h-[430px]",
                "relative"
            )}
        >
            <table className="table-fixed w-full text-left">
                <thead className="w-full">
                    <tr
                        className={twMerge(
                            "w-full flex-row sticky top-0 bg-white dark:bg-gray-700 shadow-md dark:shadow-none h-16 sm:h-12"
                        )}
                    >
                        <th className="pl-2 w-full">DID</th>
                    </tr>
                </thead>
                <tbody className="w-full">
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
            <div className="w-full flex justify-center space-x-2 pt-2 border-t dark:border-gray-400 dark:border-t-2">
                <nav className="w-[400px] flex justify-center space-x-2">
                    <span className="w-1/3 flex space-x-2">
                        <Button
                            onClick={() => {
                                table.setPageIndex(0)
                            }}
                            disabled={!table.getCanPreviousPage()}
                            icon={<HiChevronDoubleLeft />}
                        />
                        <Button
                            onClick={() => {
                                table.previousPage()
                            }}
                            disabled={!table.getCanPreviousPage()}
                            icon={<HiChevronLeft />}
                        />
                    </span>
                    <span className="w-1/3 inline-flex space-x-2 items-end">
                        <NumInput
                            value={pageIndex + 1}
                            onChange={(event) => {
                                setPageIndex(event.target.value - 1)
                            }}
                            min={1}
                            max={table.getPageCount()}
                        />
                        <span className="w-full">
                            <P>
                                of {table.getPageCount()}
                            </P>
                        </span>
                    </span>
                    <span className="w-1/3 space-x-2 flex">
                        <Button
                            onClick={() => {
                                table.nextPage()
                            }}
                            disabled={!table.getCanNextPage()}
                            icon={<HiChevronRight />}
                        />
                        <Button
                            onClick={() => {
                                table.setPageIndex(table.getPageCount() - 1)
                            }}
                            disabled={!table.getCanNextPage()}
                            icon={<HiChevronDoubleRight />}
                        />
                    </span>
                </nav>
            </div>
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