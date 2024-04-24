import { Table, flexRender } from "@tanstack/react-table";
import { TableStyling } from "./types";
import { twMerge } from "tailwind-merge";
import { StyleMetaColumnDef } from "./types";

export function TableHeader<T>(props: JSX.IntrinsicElements["thead"] & {
    table: Table<T>
    tablestyling?: TableStyling
}) {
    const { className, ...otherprops } = props
    const table = props.table
    return (
        <thead
            role="rowgroup"
            aria-label="Table Header"
            className={twMerge(className ?? "")}
            {...otherprops}
        >
            <tr
                className={twMerge(
                    "h-16 md:h-12",
                    "bg-neutral-0 dark:bg-neutral-700",
                    "relative",
                    props.tablestyling?.tableHeadRowStyle ?? "",
                )}
                role="row"
            >
                {table.getLeafHeaders().map(header => {
                    return (
                        <th
                            key={header.id}
                            className={(header.column.columnDef as StyleMetaColumnDef<T>).meta?.style ?? ""}
                            role="columnheader"
                            aria-label={header.id}
                        >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                    )
                })}
            </tr>
        </thead >
    )
}