import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";
import { Table } from "@tanstack/react-table";
import { twMerge } from "tailwind-merge";
import { TablePaginationNav } from "./TablePaginationNav";
import { TableFetchstatus } from "./TableFetchstatus";
import { TableBreakout } from "./TableBreakout";

type TableFooterProps<T> = JSX.IntrinsicElements["tfoot"] & {
    table: Table<T>,
    comdom: UseComDOM<T>
    breakout?: {
        breakoutVisibility: boolean,
        keys: Record<string, string>,
    }
}

export function TableFooter<T>(props: TableFooterProps<T>) {
    const { className, ...otherprops } = props

    return (
        <tfoot
            className={twMerge(
                "h-8",
                className ?? "",
            )}
            role="rowgroup"
            aria-label="Table Footer"
            {...otherprops}
        >
            <tr aria-label="Extra Information">
                <td
                    className={twMerge(
                        props.breakout?.breakoutVisibility ? "table-cell" : "hidden"
                    )}
                    colSpan={props.table.getVisibleLeafColumns().length}
                >
                    <TableBreakout
                        keys={props.breakout?.keys ?? {} as Record<string, string>}
                        row={props.table.getSelectedRowModel().flatRows[0]}
                    />
                </td>
            </tr>
            <tr aria-label="Pagination and Stream Controls">
                <td
                    colSpan={props.table.getVisibleLeafColumns().length}
                >
                    <div
                        className={twMerge(
                            "relative",
                            "flex flex-col space-y-1 md:space-y-0 items-center",
                        )}
                    >
                        <div
                            className={twMerge(
                                "w-full md:w-[400px]",
                            )}
                        >
                            <TablePaginationNav table={props.table} />
                        </div>
                        <TableFetchstatus
                            className={twMerge(
                                "md:absolute md:inset-y-0 md:right-0",
                                "w-full md:w-36 lg:w-48"
                            )}
                            comdom={props.comdom}
                        />
                    </div>
                </td>
            </tr>
        </tfoot>
    );
}
