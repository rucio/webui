import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";
import { Table } from "@tanstack/react-table";
import { twMerge } from "tailwind-merge";
import { TablePaginationNav } from "./TablePaginationNav";
import { TableFetchstatus } from "./TableFetchstatus";
import { TableBreakout } from "./TableBreakout";
import { TableErrorstatus } from "./TableErrorstatus";
import { TableErrorreader } from "./TableErrorreader";
import { useState } from "react";

/**
 * @param T the type of the data in the table
 * @param table the table object
 * @param comdom the comdom object
 * @param breakout if breakout is defined, the breakout will be shown
 * @param stacked if true, the pagination and fetchstatus will be stacked vertically
 */
type TableFooterProps<T> = JSX.IntrinsicElements["tfoot"] & {
    table: Table<T>,
    comdom: UseComDOM<any> // TODO: fix this any, use BaseViewModel
    breakout?: {
        breakoutVisibility: boolean,
        keys: Record<string, string>,
    }
    stacked?: boolean // to save horizontal space
}

export function TableFooter<T>(props: TableFooterProps<T>) {
    const { stacked, className, ...otherprops } = props
    const [showDetailedErrors, setShowDetailedErrors] = useState<boolean>(false)

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
                            !props.stacked ? "flex flex-col space-y-1 md:space-y-0 items-center" : "flex flex-col space-y-1 items-center",
                        )}
                    >
                        <TableErrorstatus
                            className={twMerge(
                                !props.stacked ? "md:absolute md:inset-y-0 md:left-0 md:w-36 lg:w-48" : "md:space-x-2 md:justify-center md:w-[400px]",
                                "w-full"
                            )}
                            comdom={props.comdom}
                            showDetailedErrors={showDetailedErrors}
                            setShowDetailedErrors={setShowDetailedErrors}
                        />
                        <div
                            className={twMerge(
                                "w-full md:w-[400px]",
                            )}
                        >
                            <TablePaginationNav table={props.table} />
                        </div>
                        <TableFetchstatus
                            className={twMerge(
                                !props.stacked ? "md:absolute md:inset-y-0 md:right-0 md:w-36 lg:w-48" : "md:space-x-2 md:justify-center md:w-[400px]",
                                "w-full"
                            )}
                            comdom={props.comdom}
                        />
                    </div>
                </td>
            </tr>
            <tr aria-label="View the error messages">
                <td
                    colSpan={props.table.getVisibleLeafColumns().length}
                    className={twMerge(
                        showDetailedErrors ? "table-cell" : "hidden"
                    )}
                >
                    <TableErrorreader
                        comdom={props.comdom}
                        showDetailedErrors={showDetailedErrors}
                        setShowDetailedErrors={setShowDetailedErrors}
                    />
                </td>
            </tr>
        </tfoot>
    );
}
