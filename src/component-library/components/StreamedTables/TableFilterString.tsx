import { twMerge } from "tailwind-merge";
import { H3 } from "../Text/Headings/H3";
import { Column, Table } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { HiCheck, HiSearch } from "react-icons/hi";


type TableFilterString = JSX.IntrinsicElements["div"] & {
    column: Column<any, string>,
    name: string,
    placeholder?: string,
}

const Filter = (props: JSX.IntrinsicElements["input"] & { column: Column<any, string> }) => {
    const { column, className, ...otherprops } = props
    return (
        <input
            type="text"
            value={column.getFilterValue() as string ?? ""}
            onChange={(e) => column.setFilterValue(e.target.value)}
            className={twMerge(
                "w-full border dark:border-gray-400 rounded-sm px-2 pt-2 dark:bg-gray-800 dark:text-white h-8",
                className ?? "",
            )}
            {...otherprops}
        />
    )
}

export function TableFilterString(
    props: TableFilterString
): JSX.Element {
    const { column, name, placeholder, ...otherprops } = props
    const { className, ...otherdivprops } = otherprops

    const [windowSize, setWindowSize] = useState([
        1920, 1080
    ]);

    useEffect(() => {
        setWindowSize([window.innerWidth, window.innerHeight])

        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    const [smallScreenNameFiltering, setSmallScreenNameFiltering] = useState(false)
    useEffect(() => {
        if (windowSize[0] > 640) {
            setSmallScreenNameFiltering(false)
        }
    }, [windowSize])

    /*
    `smallScreenNameFiltering` is a boolean that controls whether the filter is
    shown on small screens.
    It is set to false on large screens, and can be toggled on small screens.
    */

    if (!smallScreenNameFiltering) {
        return (
            <div
                className={twMerge(
                    "flex flex-row justify-between items-baseline space-x-8",
                    "pr-2",
                    className ?? "",
                )}
            >
                <span className="shrink-0">
                    <H3>{name}</H3>
                </span>
                <Filter
                    column={column}
                    placeholder={placeholder ?? `Filter ${name}`}
                    className="hidden sm:block"
                />

                <button
                    onClick={(e) => { setSmallScreenNameFiltering(!smallScreenNameFiltering) }}
                    className="sm:hidden pr-4"
                >
                    <HiSearch className="text-xl text-gray-500 dark:text-gray-200" />
                </button>
            </div>
        )
    } else {
        return (
            <div
                className={twMerge(
                    "flex",
                    "bg-white",
                    "absolute inset-0",
                    "p-2 flex-row justify-between space-x-2 items-center"
                )}
            >
                <Filter column={column} placeholder={placeholder ?? `Filter ${name}`} />
                <button
                    onClick={(e) => { setSmallScreenNameFiltering(!smallScreenNameFiltering) }}
                >
                    <HiCheck className="text-xl text-gray-500 dark:text-gray-200" />
                </button>
            </div>
        )
    }
}