import { twMerge } from "tailwind-merge";
import { TableFooter } from "./TableFooter";
import { BaseViewModel } from "@/lib/sdk/view-models";
import { TableBody } from "./TableBody";
import { TableHeader } from "./TableHeader";
import { StreamedTableProps } from "./types";
import { usePrepareTable } from "./helpers";

export function StreamedTable<T>(props: StreamedTableProps<T>) {
    const { className, ...otherprops } = props

    const { table, rowSelection, setRowSelection, breakoutVisibility, setBreakoutVisibility } = usePrepareTable<T>({
        tabledata: props.tablecomdom.query.data.all || [],
        successViewModels: props.tablecomdom.query.data.success,
        errorViewModels: props.tablecomdom.query.data.error,
        tablecolumns: props.tablecolumns,
        tablestyling: props.tablestyling,
        tableselecting: props.tableselecting,
    })

    return (
        <table
            className={twMerge(
                props.tablecomdom.query.fetchStatus === "fetching" ? "hover:cursor-wait" : "",
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
            <TableFooter
                table={table}
                comdom={props.tablecomdom}
                breakout={{
                    breakoutVisibility: breakoutVisibility,
                    keys: props.tableselecting?.breakOut?.keys ?? {} as Record<string, string>,
                }}
                stacked={props.tablestyling?.tableFooterStack ?? false}
            />
        </table>
    )
}