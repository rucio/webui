import { StyleMetaColumnDef, TableData } from "@/lib/infrastructure/data/view-model/streamedtables";
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { FetchstatusIndicator } from "./FetchstatusIndicator";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { PaginationDiv } from "./PaginationDiv";

type StreamedTableProps<T> = JSX.IntrinsicElements["table"] & {
    tabledata: TableData<T>
    tablecolumns: any[] // todo type this
    tablestyling?: Partial<{
        visibility?: Record<string, boolean>
        tableHeadRowStyle?: string
        tableBodyRowStyle?: string
    }>
}

export function StreamedTable<T>(props: StreamedTableProps<T>) {
    const { className, ...otherprops } = props

    const table = useReactTable<T>({
        data: props.tabledata.data || [],
        columns: props.tablecolumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
        state: {
            columnVisibility: props.tablestyling?.visibility,
        }
    })

    // Pagination
    const [pageIndex, setPageIndex] = useState(table.getState().pagination.pageIndex)
    useEffect(() => {
        setPageIndex(table.getState().pagination.pageIndex)
    }, [table])
    useEffect(() => {
        table.setPageIndex(pageIndex)
    }, [pageIndex, table])
    useEffect(() => {
        table.setPageSize(props.tabledata.pageSize)
    }, [props.tabledata.pageSize, table])

    return (
        <table
            className={twMerge(
                props.tabledata.fetchStatus === "fetching" ? "hover:cursor-wait" : "",
                "bg-white dark:bg-gray-700",
                "w-full",
                "relative",
                "table-fixed",
                className
            )}
            {...otherprops}
        >
            <thead>
                <tr
                    className={twMerge(
                        "h-16 md:h-12",
                        "bg-white dark:bg-gray-700",
                        "relative",
                        props.tablestyling?.tableHeadRowStyle ?? "",
                    )}
                >
                    {table.getLeafHeaders().map(header => {
                        return (
                            <th
                                key={header.id}
                                className={(header.column.columnDef as StyleMetaColumnDef<T>).meta?.style ?? ""}
                            >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        )
                    })}
                </tr>
            </thead>
            <div
                className={twMerge(
                    "absolute",
                    "top-12 right-0 m-2",
                    "pointer-events-none"
                )}
            >
                <FetchstatusIndicator status={props.tabledata.fetchStatus} />
            </div>
            <tbody>
                {table.getRowModel().rows.map(row => {
                    return (
                        <tr
                            key={row.id}
                            className={twMerge(
                                "hover:cursor-normal h-16 md:h-8",
                                "bg-white odd:bg-stone-100",
                                "dark:bg-gray-700 dark:odd:bg-gray-800",
                                "hover:bg-gray-200 dark:hover:bg-gray-900",
                                props.tablestyling?.tableBodyRowStyle ?? "",
                            )}
                        >
                            {row.getVisibleCells().map(cell => {
                                return (
                                    <td
                                        key={cell.id}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={table.getVisibleLeafColumns().length}>
                        <PaginationDiv
                            table={table}
                        />
                    </td>
                </tr>
            </tfoot>
        </table>
    )
}