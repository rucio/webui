import { twMerge } from "tailwind-merge";
import { H3 } from "../Text/Headings/H3";
import { Column } from "@tanstack/react-table";
import { useState } from "react";
import { HiSortAscending, HiSortDescending, HiDotsHorizontal } from "react-icons/hi";

export function TableSortUpDown(
    props: JSX.IntrinsicElements["div"] & {
        name: string
        column: Column<any, any>
        element?: JSX.Element // to replace name
    }
): JSX.Element {
    const { name, column, element, ...otherprops } = props
    const { className, ...otherdivprops } = otherprops
    type updown = "null" | "desc" | "asc"
    const [state, setState] = useState<updown>("null")
    const next = {
        "null": "desc",
        "desc": "asc",
        "asc": "null",
    }
    return (
        <div
            className={twMerge(
                "flex flex-row justify-between space-x-2",
                "h-6 sm:pr-1",
                "items-center",
                "select-none cursor-pointer",
                className ?? "",
            )}
            onClick={e => {
                column.toggleSorting()
                setState(next[state] as updown)
            }}
            {...otherdivprops}
        >
            {
                element ?? <H3 className="hidden md:inline">{name}</H3>
            }
            <span className="text-gray-500 dark:text-gray-200 text-xl h6">
                {
                    {
                        asc: <HiSortAscending />, desc: <HiSortDescending />, "null": <HiDotsHorizontal />
                    }[state]
                }
            </span>
        </div>
    )
}