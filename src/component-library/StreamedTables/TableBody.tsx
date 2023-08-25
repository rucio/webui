import { Table, flexRender } from "@tanstack/react-table";
import { twMerge } from "tailwind-merge";
import { TableStyling } from "./types";

export function TableBody<T>(props: JSX.IntrinsicElements["tbody"] & 
    { 
        table: Table<T>
        tablestyling?: TableStyling
    }
) {
    const { className, ...otherprops } = props
    const table = props.table
    return (
        <tbody
            role="rowgroup"
            aria-label="Table Body"
            className={twMerge(className ?? "")}
            {...otherprops}
        >
            {table.getRowModel().rows.map(row => {
                const selected = row.getIsSelected()
                return (
                    <tr
                        key={row.id}
                        className={twMerge(
                            "h-16 md:h-8",
                            selected ? "bg-blue-200 odd:bg-blue-200" : "bg-white odd:bg-stone-100", // bg normal
                            selected ? "dark:bg-blue-500 odd:dark:bg-blue-500" : "dark:bg-gray-700 dark:odd:bg-gray-800", // bg dark
                            selected ? "hover:bg-blue-300  dark:hover:bg-blue-600" : "hover:bg-gray-200 dark:hover:bg-gray-900", // hover (dark and light)
                            selected ? "border-blue-400 dark:border-blue-700 border" : "", // handle border when selected
                            row.getCanSelect() ? "hover:cursor-pointer" : "hover:cursor-normal", // handle cursor when selectable
                            props.tablestyling?.tableBodyRowStyle ?? "",
                        )}
                        onClick={(e) => {
                            if (row.getCanSelect()) {
                                row.toggleSelected()
                            }
                        }}
                        role="row"
                        aria-selected={row.getCanSelect() ? selected : undefined} // undefined => not selectable
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
    )
}