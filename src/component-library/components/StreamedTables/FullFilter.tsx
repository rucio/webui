import { twMerge } from "tailwind-merge";
import { FC, useState, useEffect } from "react";
import { Column, Table } from "@tanstack/react-table";
import { Filter } from "./Filter";
import { HiChevronDoubleLeft, HiChevronLeft, HiChevronRight, HiChevronDoubleRight, HiSearch, HiCheck, HiDotsHorizontal, HiExternalLink } from "react-icons/hi"

type FullFilterProps = JSX.IntrinsicElements["div"] & {
    columnTitle: string,
    placeholder?: string,
    column: Column<any, any>,
    table: Table<any>
}

export const FullFilter: FC<FullFilterProps> = (
    {
        columnTitle,
        placeholder,
        column,
        table,
        ...props
    }
) => {
    const [windowSize, setWindowSize] = useState([
        1920, 1080
    ]);
    const [smallScreenNameFiltering, setSmallScreenNameFiltering] = useState(false)
    useEffect(() => {
        if (windowSize[0] > 640) {
            setSmallScreenNameFiltering(false)
        }
    }, [windowSize])
    return (
        <div {...props}>
            <div className="flex flex-row items-baseline space-x-8 justify-between">
                <span className="shrink-0">
                    <h3 className="text-xl">DID</h3>
                </span>
                <span className="hidden sm:flex w-full">
                    <Filter column={column} table={table} />
                </span>
                <span className="flex sm:hidden pr-4 relative">
                    <button
                        onClick={(e) => { setSmallScreenNameFiltering(!smallScreenNameFiltering) }}
                    >
                        <HiSearch className="text-xl text-gray-500 dark:text-gray-200" />
                    </button>
                </span>
            </div>
            <div
                id="smallScreenNameFiltering"
                className={twMerge(
                    "absolute inset-0",
                    smallScreenNameFiltering ? "flex" : "hidden",
                    "bg-white",
                    "p-2 flex-row justify-between space-x-2 items-center"
                )}
            >
                <Filter column={column} table={table} />
                <button
                    onClick={(e) => { setSmallScreenNameFiltering(!smallScreenNameFiltering) }}
                >
                    <HiCheck className="text-xl text-gray-500 dark:text-gray-200" />
                </button>
            </div>
        </div>
    );
};
