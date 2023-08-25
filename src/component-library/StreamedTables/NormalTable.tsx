import {
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
    getSortedRowModel, RowSelectionState, useReactTable
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { TablePaginationNav } from "./TablePaginationNav";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { NormalTableProps } from "./types";


export function NormalTable<T>(props: NormalTableProps<T>) {
    const { className, ...otherprops } = props

    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

    const table = useReactTable<T>({
        data: props.tabledata || [],
        columns: props.tablecolumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: false,
        enableRowSelection: props.tableselecting?.enableRowSelection ?? false,
        enableMultiRowSelection: props.tableselecting?.enableMultiRowSelection ?? false,
        onRowSelectionChange: setRowSelection,
        state: {
            columnVisibility: props.tablestyling?.visibility,
            rowSelection: rowSelection
        }
    })

    // https://github.com/TanStack/table/discussions/2155#discussioncomment-6010065
    useEffect(() => {
        props.tableselecting?.handleChange(table.getSelectedRowModel().flatRows.map((row) => row.original))
    }, [rowSelection, table])
    // `enableRowSelection` might be subject to change => clear selection if changes to false
    useEffect(() => {
        if (props.tableselecting?.enableRowSelection === false) {
            table.setRowSelection({})
        }
    }, [props.tableselecting?.enableRowSelection])


    // Pagination
    const [pageIndex, setPageIndex] = useState(table.getState().pagination.pageIndex)
    useEffect(() => {
        setPageIndex(table.getState().pagination.pageIndex)
    }, [table])
    useEffect(() => {
        table.setPageIndex(pageIndex)
    }, [pageIndex, table])
    // Page number
    useEffect(() => {
        table.setPageSize(props.tablestyling?.pageSize ?? 10) // default to 10
    }, [props.tablestyling?.pageSize, table])

    return (
        <table
            className={twMerge(
                "bg-white dark:bg-gray-700",
                "w-full",
                "relative",
                "table-fixed",
                className
            )}
            {...otherprops}
            role="grid" // if table maintains selection state or allows 2D nav -> use grid
        // see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/table_role#description
        >
            <TableHeader table={table} tablestyling={props.tablestyling} />
            <TableBody table={table} tablestyling={props.tablestyling} />
            <tfoot
                className={twMerge("h-8")}
                role="rowgroup"
                aria-label="NormalTable Footer"
            >
                <tr aria-label="Pagination Controls">
                    <td
                        colSpan={table.getVisibleLeafColumns().length}
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-full md:w-[400px]">
                                <TablePaginationNav table={table} />
                            </div>
                        </div>
                    </td>
                </tr>

            </tfoot>
        </table>
    )
}