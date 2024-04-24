import { twMerge } from "tailwind-merge";
import { H3 } from "../Text/Headings/H3";
import { Column, Table } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { HiCheck, HiSearch } from "react-icons/hi";


type TableFilterString = JSX.IntrinsicElements["form"] & {
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
                "w-full border dark:border-neutral-400 rounded-sm px-2 pt-2 dark:bg-neutral-800 bg-neutral-0 dark:text-text-0 text-text-1000 h-8",
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
            <form
                className={twMerge(
                    "flex flex-row justify-between items-baseline space-x-8",
                    "pr-2",
                    className ?? "",
                )}
                role="search"
                aria-label={`Filter ${name} Column`}
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
                    <HiSearch className="text-xl text-text-500 dark:text-text-200" />
                </button>
            </form>
        )
    } else {
        return (
            <form
                className={twMerge(
                    "flex",
                    "bg-neutral-0 dark:bg-neutral-800",
                    "absolute inset-0",
                    "p-2 flex-row justify-between space-x-2 items-center"
                )}
                role="search"
                aria-label={`Filter ${name} Column`}
            >
                <Filter column={column} placeholder={placeholder ?? `Filter ${name}`} />
                <button
                    onClick={(e) => { setSmallScreenNameFiltering(!smallScreenNameFiltering) }}
                >
                    <HiCheck className="text-xl text-text-500 dark:text-text-200" />
                </button>
            </form>
        )
    }
}