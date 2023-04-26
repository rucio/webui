import { H3 } from "@/component-library/components/Text/Headings/H3"
import { P } from "@/component-library/components/Text/Content/P"
import { Button } from "../Button/Button"
import { Number } from "../Text/Content/Number"
import { DIDTypeTag } from "../Tags/DIDTypeTag"
import { NumInput } from "../Input/NumInput"
import { Label } from "../Text/Content/Label"
import { Filter } from "./Filter"

import { HiChevronDoubleLeft, HiChevronLeft, HiChevronRight, HiChevronDoubleRight } from "react-icons/hi"

import { twMerge } from "tailwind-merge"

import { useEffect, useState } from "react"

import { DIDDTO, DIDType } from "@/lib/core/data/rucio-dto"
import useComDOM from "@/lib/infrastructure/hooks/useComDOM"
import { FetchStatus } from "@tanstack/react-query"
import {
    createColumnHelper, flexRender, getCoreRowModel, TableOptions,
    useReactTable, getPaginationRowModel, getFilteredRowModel, Table,
    getSortedRowModel,
    Column, Row
} from "@tanstack/react-table"

import { HiSortAscending, HiSortDescending, HiDotsHorizontal, HiSearch, HiCheck } from "react-icons/hi"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import "@/component-library/outputtailwind.css";
import "reflect-metadata";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Dropdown } from "../Dropdown/Dropdown"
import { TextInput } from "../Input/TextInput"
import { FetchstatusIndicator } from "./FetchstatusIndicator"


export const DIDSelectTable = (
    props: {
        data: any,
        fetchstatus: FetchStatus,
        onChange: (selected: string[]) => void,
        pageSize: number,
        selected?: string[],
        useScopenames?: boolean
    }
) => {
    const columnHelper = createColumnHelper<DIDDTO>()



    const columns: any[] = [
        {
            id: 'selection',
            header: () => <span className="w-8" />,
            cell: (props: any) => {
                return <span className="ml-1 w-6 sm:ml-2 sm:w-8">
                    <input
                        type="checkbox"
                        disabled={false}
                        checked={props.row.getIsSelected()}
                        onChange={(event: any) => {
                            if (event.target.checked) {
                                setSelectedDIDs([...selectedDIDs, props.row.original.scope + ":" + props.row.original.name])
                            }
                            else {
                                setSelectedDIDs(selectedDIDs.filter((did) => did !== props.row.original.scope + ":" + props.row.original.name))
                            }
                            props.row.getToggleSelectedHandler()(event)
                        }}
                    />
                </span>
            },
        },
        columnHelper.accessor('name', {
            id: 'name',
            cell: (info) => {
                return (
                    <p
                        onClick={(event) => event.stopPropagation()}
                        className={twMerge(
                            "cursor-text flex w-fit select-all break-all",
                            "font-mono dark:text-gray-200"
                        )}
                    >
                        {props.useScopenames ? info.row.original.scope + ":" + info.getValue() : info.getValue()}
                    </p>
                )
            },
        }),
        columnHelper.accessor('scope', {
            id: 'scope',
            cell: (info) => { <P mono className="break-all">{info.getValue()}</P> },
        }),
        columnHelper.accessor('did_type', {
            id: 'did_type',
            cell: (info) => {
                return (
                    <div className="flex flex-row items-center justify-center">
                        <DIDTypeTag type={info.row.original.did_type} />
                    </div>
                )
            },
        }),
        columnHelper.accessor('bytes', {
            id: 'bytes',
            cell: (info) =>
                <p className="font-mono dark:text-gray-200">
                    <Number number={info.getValue()} />
                </p>,
        }),
        columnHelper.accessor('length', {
            id: 'length',
            cell: (info) => <P mono>{info.getValue()}</P>,
        }),
    ]
    const [columnVisibility, setColumnVisibility] = useState(
        {
            selection: true,
            name: true,
            bytes: true,
            scope: false,
            did_type: true,
            length: false,
        }
    )

    const table = useReactTable<DIDDTO>({
        data: props.data || [],
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
        enableRowSelection: true,
        state: {
            columnVisibility: columnVisibility,
        }
    } as TableOptions<DIDDTO>)

    // most important part: selecting DIDs (rows)
    // this is handled OUTSIDE of tanstack
    const [selectedDIDs, setSelectedDIDs] = useState<string[]>(props.selected ?? [])
    // if the selection is changed externally, reflect this internally
    useEffect(() => {
        setSelectedDIDs(props.selected ?? [])
    }, [props.selected])
    // if the selection is changed internally, reflect this externally
    useEffect(() => {
        props.onChange(selectedDIDs)
    }, [selectedDIDs])

    // Page Size: this can be removed if we don't want to allow the user to change the page size
    const [pageSize, setPageSize] = useState(props.pageSize)
    useEffect(() => {
        setPageSize(props.pageSize)
    }, [props.pageSize])
    useEffect(() => {
        table.setPageSize(pageSize)
    }, [pageSize])

    // Pagination
    const [pageIndex, setPageIndex] = useState(table.getState().pagination.pageIndex)
    useEffect(() => {
        setPageIndex(table.getState().pagination.pageIndex)
    }, [table.getState().pagination.pageIndex])
    useEffect(() => {
        table.setPageIndex(pageIndex)
    }, [pageIndex])

    // filtering by DID Type
    const [filterType, setFilterType] = useState<DIDType | undefined>(undefined)

    // handle window resize
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
    // using the window size to determine whether we shall show the input form with full width
    const [smallScreenNameFiltering, setSmallScreenNameFiltering] = useState(false)
    useEffect(() => {
        if (windowSize[0] > 640) {
            setSmallScreenNameFiltering(false)
        }
    }, [windowSize])

    return (
        <div
            className={twMerge(
                "border dark:border-2 rounded-md",
                props.fetchstatus === "fetching" ? "hover:cursor-wait" : "",
                "flex flex-col justify-between space-y-2 pb-2",
                "bg-white dark:bg-gray-700",
                "h-[430px]",
                "relative"
            )}
        >
            <table className="table-fixed w-full text-left">
                <thead className="w-full">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr
                            key={headerGroup.id}
                            className="w-full flex-row sticky top-0 bg-white dark:bg-gray-700 shadow-md dark:shadow-none h-16 sm:h-12"
                        >
                            <th className="w-6 sm:w-8 grow-0"></th>
                            <th className="w-1/2 sm:w-2/3 flex-auto">
                                <div className="flex flex-row items-center space-x-8 justify-between">
                                    <span className="shrink-0">
                                        <H3>{props.useScopenames ? "DID" : "DID Name"}</H3>
                                    </span>
                                    <span className="hidden sm:flex w-full">
                                        <Filter column={table.getColumn("name") as Column<DIDDTO, unknown>} table={table} />
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
                                    <Filter column={table.getColumn("name") as Column<DIDDTO, unknown>} table={table} />
                                    <button
                                        onClick={(e) => { setSmallScreenNameFiltering(!smallScreenNameFiltering) }}
                                    >
                                        <HiCheck className="text-xl text-gray-500 dark:text-gray-200" />
                                    </button>
                                </div>
                            </th>
                            <th
                                className="flex-auto hover:cursor-pointer select-none"
                                onClick={(e) => {
                                    // create a match statement for the filter type
                                    const filterchange = (filterType: DIDType | undefined) => {
                                        setFilterType(filterType)
                                        var column = table.getColumn("did_type") as Column<DIDDTO, unknown>
                                        column.setFilterValue(filterType ?? "")
                                    }
                                    switch (filterType) {
                                        case undefined: {
                                            filterchange("File")
                                            break
                                        }
                                        case "File": {
                                            filterchange("Dataset")
                                            break
                                        }
                                        case "Dataset": {
                                            filterchange("Container")
                                            break
                                        }
                                        case "Container": {
                                            filterchange(undefined)
                                            break
                                        }
                                    }
                                }}
                            >
                                <span className="flex flex-col sm:flex-row justify-between items-center pr-1 space-y-1 md:pr-4">
                                    <H3>Type</H3>
                                    <span className="h-6">
                                        {
                                            filterType === undefined ? <HiDotsHorizontal className="text-xl text-gray-500 dark:text-gray-200" /> : <DIDTypeTag type={filterType} forcesmall />
                                        }
                                    </span>
                                </span>
                            </th>
                            <th
                                className={twMerge(
                                    "flex-auto",
                                    "hover:cursor-pointer select-none"
                                )}
                                onClick={(e) => {
                                    headerGroup.headers.find((h) => h.id === "bytes")?.column.getToggleSortingHandler()?.(e)
                                }}
                            >
                                <span className="flex flex-col sm:flex-row justify-between items-center pr-1 space-y-1 md:pr-4">
                                    <H3>Size</H3>
                                    <span className="text-gray-500 dark:text-gray-200 text-xl h-6">
                                        {
                                            {
                                                asc: <HiSortAscending />, desc: <HiSortDescending />,
                                            }[headerGroup.headers.find((h) => h.id === "bytes")?.column.getIsSorted() as string] ??
                                            <HiDotsHorizontal />
                                        }
                                    </span>
                                </span>
                            </th>
                        </tr>
                    ))}
                </thead>
                <tbody
                    className={twMerge("w-full")}
                >
                    {table.getRowModel().rows.map((row) => {
                        const did_scopename = row.original.scope + ":" + row.original.name
                        const isDIDSelected = selectedDIDs.includes(did_scopename)
                        return (
                            <tr
                                className={twMerge(
                                    "w-full border-b dark:border-gray-500 hover:cursor-pointer h-16 md:h-8",
                                    isDIDSelected ? "bg-blue-200 hover:bg-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600" : "hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-900",
                                )}
                                // className={isDIDSelected ? classesSelected : classesNormal}
                                key={row.id}
                                onClick={(event) => {
                                    // if there is no more quota remaining, do nothing on click
                                    if (isDIDSelected) {
                                        setSelectedDIDs(selectedDIDs.filter(id => id !== did_scopename))
                                    } else {
                                        setSelectedDIDs([...selectedDIDs, did_scopename])
                                    }
                                    row.getToggleSelectedHandler()(event)
                                }}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td
                                        key={cell.id}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="w-full flex justify-center space-x-2">
                <nav className="w-[400px] flex justify-center space-x-2">
                    <span className="w-1/3 flex space-x-2">
                        <Button
                            onClick={() => {
                                table.setPageIndex(0)
                            }}
                            disabled={!table.getCanPreviousPage()}
                            icon={<HiChevronDoubleLeft />}
                        />
                        <Button
                            onClick={() => {
                                table.previousPage()
                            }}
                            disabled={!table.getCanPreviousPage()}
                            icon={<HiChevronLeft />}
                        />
                    </span>
                    <span className="w-1/3 inline-flex space-x-2 items-end">
                        <NumInput
                            value={pageIndex + 1}
                            onChange={(event) => {
                                setPageIndex(event.target.value - 1)
                            }}
                            min={1}
                            max={table.getPageCount()}
                        />
                        <span className="w-full">
                            <P>
                                of {table.getPageCount()}
                            </P>
                        </span>
                    </span>
                    <span className="w-1/3 space-x-2 flex">
                        <Button
                            onClick={() => {
                                table.nextPage()
                            }}
                            disabled={!table.getCanNextPage()}
                            icon={<HiChevronRight />}
                        />
                        <Button
                            onClick={() => {
                                table.setPageIndex(table.getPageCount() - 1)
                            }}
                            disabled={!table.getCanNextPage()}
                            icon={<HiChevronDoubleRight />}
                        />
                    </span>
                </nav>
            </div>
            <div
                className={twMerge(
                    "absolute",
                    "top-16 sm:top-12 right-2",
                )}
            >
                <FetchstatusIndicator status={props.fetchstatus} />
            </div>
        </div>
    )
}