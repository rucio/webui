import { FetchStatus } from "@tanstack/react-query";
import { FetchstatusIndicator } from "../../StreamedTables/FetchstatusIndicator";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, TableOptions, useReactTable } from "@tanstack/react-table";
import { DIDMeta } from "@/lib/core/data/rucio-dto";

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
                        <th className="pl-2 w-full">Hi</th>
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
        </div>
    )
}