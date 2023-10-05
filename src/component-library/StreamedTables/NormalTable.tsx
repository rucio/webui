import { twMerge } from "tailwind-merge";
import { TablePaginationNav } from "./TablePaginationNav";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { NormalTableProps } from "./types";
import { usePrepareTable } from "./helpers";
import { TableBreakout } from "./TableBreakout";


export function NormalTable<T>(props: NormalTableProps<T>) {
    const { className, ...otherprops } = props

    const { table, ...othertables } = usePrepareTable<T>({
        tabledata: props.tabledata,
        tablecolumns: props.tablecolumns,
        tablestyling: props.tablestyling,
        tableselecting: props.tableselecting,
    })

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
                <tr aria-label="Extra Information">
                <td
                    className={twMerge(
                        props.tableselecting?.breakOut?.breakoutVisibility ? "table-cell" : "hidden"
                    )}
                    colSpan={table.getVisibleLeafColumns().length}
                >
                    <TableBreakout
                        keys={props.tableselecting?.breakOut?.keys ?? {} as Record<string, string>}
                        row={table.getSelectedRowModel().flatRows[0]}
                    />
                </td>
            </tr>
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