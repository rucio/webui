import { StyleMetaColumnDef, TableData } from "@/lib/infrastructure/data/view-model/streamedtables";
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { FetchstatusIndicator } from "./FetchstatusIndicator";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { PaginationDiv } from "./PaginationDiv";

type StreamedTableProps<T> = JSX.IntrinsicElements["table"] & {
    tableData: TableData<T>
    tableColumns: any[] // todo type this
    tableStyling?: Partial<{
        visibility: Record<string, boolean>
    }>
}

export function StreamedTable<T>(props: StreamedTableProps<T>) {
    const { className, ...otherprops } = props

    const table = useReactTable<T>({
        data: props.tableData.data || [],
        columns: props.tableColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
        state: {
            columnVisibility: props.tableStyling?.visibility,
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
        table.setPageSize(props.tableData.pageSize)
    }, [props.tableData.pageSize, table])

    return (
        <table
            className={twMerge(
                props.tableData.fetchStatus === "fetching" ? "hover:cursor-wait" : "",
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
                        "bg-white dark:bg-gray-700"
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
                <FetchstatusIndicator status={props.tableData.fetchStatus} />
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
                            pageIndex={pageIndex}
                            setPageIndex={setPageIndex}
                        />
                    </td>
                </tr>
            </tfoot>
        </table>
    )
}