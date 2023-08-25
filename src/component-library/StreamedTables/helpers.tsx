import { DID } from "@/lib/core/entity/rucio";
import { TableSelecting, TableStyling } from "./types";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel, RowSelectionState } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export function didToScopename(list: DID[]): string[] {
    return list.map(did => did.scope + ":" + did.name)
}

export function usePrepareTable<T>(props: {
    tabledata: T[]
    tablecolumns: any[]
    tablestyling?: TableStyling
    tableselecting?: TableSelecting<T>
}) {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const table = useReactTable<T>({
        data: props.tabledata,
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
            rowSelection: rowSelection,
        },
    })

    // pagination
    const [pageIndex, setPageIndex] = useState(table.getState().pagination.pageIndex)
    useEffect(() => {
        setPageIndex(table.getState().pagination.pageIndex)
    }, [table])
    useEffect(() => {
        table.setPageIndex(pageIndex)
    }, [pageIndex, table])

    // page size
    useEffect(() => {
        table.setPageSize(props.tablestyling?.pageSize ?? 10) // default to 10
    }, [props.tablestyling?.pageSize, table])

    // selection
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


    // Breakout
    const [breakoutVisibility, setBreakoutVisibility] = useState(props.tableselecting?.breakOut?.breakoutVisibility ?? false)
    useEffect(() => {
        setBreakoutVisibility(props.tableselecting?.breakOut?.breakoutVisibility ?? false)
    }, [props.tableselecting?.breakOut?.breakoutVisibility])

    return { table, rowSelection, setRowSelection, breakoutVisibility, setBreakoutVisibility }
}