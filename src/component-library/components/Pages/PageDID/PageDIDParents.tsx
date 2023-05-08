import { DIDParents } from "@/lib/infrastructure/data/view-model/pagedid"
import { FetchStatus } from "@tanstack/react-query"
import { createColumnHelper, useReactTable, TableOptions, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, Column, flexRender } from "@tanstack/react-table"
import { twMerge } from "tailwind-merge"
import { useEffect, useState } from "react"

import { Button } from "../../Button/Button";
import { P } from "../../Text/Content/P";
import { H3 } from "../../Text/Headings/H3";
import { Filter } from "../../StreamedTables/Filter";
import { NumInput } from "../../Input/NumInput";
import { HiChevronDoubleLeft, HiChevronLeft, HiChevronRight, HiChevronDoubleRight, HiSearch, HiCheck, HiDotsHorizontal, HiExternalLink} from "react-icons/hi"
import { DIDTypeTag } from "../../Tags/DIDTypeTag";
import { FetchstatusIndicator } from "../../StreamedTables/FetchstatusIndicator"
import { DIDType} from "@/lib/core/data/rucio-dto"

export const PageDIDParents = (
    props: {
        data: any,
        fetchStatus: FetchStatus
        pageSize: number
    }
) => {
    const columnHelper = createColumnHelper<DIDParents>()
    const columns: any[] = [
        columnHelper.accessor(row => `${row.scope}:${row.name}`, {
            id: "did",
            cell: (info) => {
                return (
                    <span className="flex flex-row justify-start space-x-2 items-center">
                        <p
                            className={twMerge(
                                "pl-2 select-all"
                            )}
                        >
                            {info.getValue()}
                        </p>
                        <a
                            href={"/pagedid/" + info.getValue()}
                            className={twMerge(
                                "text-gray-600 hover:text-blue-600",
                            )}
                        >
                            <HiExternalLink className="text-l"/>
                        </a>
                    </span>
                )
            }
        }),
        columnHelper.accessor("did_type", {
            id: "did_type",
            cell: (info) => {
                return (
                    <span
                        className={twMerge(
                            "flex flex-row justify-center",
                            "sm:block sm:pl-2"
                        )}
                    >
                        <DIDTypeTag didtype={info.getValue()}/>
                    </span>
                )
            }
        })
    ]
    const table = useReactTable<DIDParents>({
        data: props.data || [],
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
        state: {
            columnVisibility: {
                did: true,
                did_type: true
            }
        }
    } as TableOptions<DIDParents>)
    
    // Filter by DID Type
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

    // Pagination
    const [pageIndex, setPageIndex] = useState(table.getState().pagination.pageIndex)
    useEffect(() => {
        setPageIndex(table.getState().pagination.pageIndex)
    }, [table.getState().pagination.pageIndex])
    useEffect(() => {
        table.setPageIndex(pageIndex)
    }, [pageIndex])
    useEffect(() => {
        table.setPageSize(props.pageSize)
    }, [props.pageSize])

    return (
        <div
            className={twMerge(
                "border dark:border-gray-200 dark:border-2 rounded-md",
                props.fetchStatus === "fetching" ? "hover:cursor-wait" : "",
                "flex flex-col justify-between space-y-2 pb-2",
                "bg-white dark:bg-gray-700",
                "h-fit min-h-[430px]",
                "relative",
                "min-w-0",
            )}
        >
            <table className="table-fixed w-full text-left">
                <thead className="w-full">
                    <tr
                        className={twMerge(
                            "w-full flex-row sticky top-0 bg-white dark:bg-gray-700 shadow-md dark:shadow-none h-16 sm:h-12"
                        )}
                    >
                        <th className="grow pl-2">
                            <div className="flex flex-row items-center space-x-8 justify-between">
                                <span className="shrink-0">
                                    <H3>DID</H3>
                                </span>
                                <span className="hidden sm:flex w-full">
                                    <Filter column={table.getColumn("did") as Column<DIDParents, unknown>} table={table} />
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
                                <Filter column={table.getColumn("did") as Column<DIDParents, unknown>} table={table} />
                                <button
                                    onClick={(e) => { setSmallScreenNameFiltering(!smallScreenNameFiltering) }}
                                >
                                    <HiCheck className="text-xl text-gray-500 dark:text-gray-200" />
                                </button>
                            </div>
                        </th>
                        <th
                            className="w-12 md:w-48 flex-none hover:cursor-pointer select-none"
                            onClick={(e) => {
                                // create a match statement for the filter type
                                const filterchange = (filterType: DIDType | undefined) => {
                                    setFilterType(filterType)
                                    var column = table.getColumn("did_type") as Column<DIDParents, unknown>
                                    column.setFilterValue(filterType ?? "")
                                }
                                switch (filterType) {
                                    case undefined: {
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
                            <span className="flex flex-col md:flex-row justify-between items-center pr-1 space-y-1 md:pr-4">
                                <H3>Type</H3>
                                <span className="h-6">
                                    {
                                        filterType === undefined ? <HiDotsHorizontal className="text-xl text-gray-500 dark:text-gray-200" /> : <DIDTypeTag didtype={filterType} forcesmall />
                                    }
                                </span>
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody className="w-full">
                    {table.getRowModel().rows.map((row) => {
                        return (
                            <tr
                                key={row.id}
                                className={twMerge(
                                    "w-full hover:cursor-normal h-16 md:h-8",
                                    "bg-white odd:bg-stone-100",
                                    "dark:bg-gray-700 dark:odd:bg-gray-800",
                                    "hover:bg-gray-200 dark:hover:bg-gray-900",
                                )}
                            >
                                {row.getVisibleCells().map((cell) => {
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
                    }
                    )}
                </tbody>
            </table>
            <div className="w-full flex justify-center space-x-2 pt-2 border-t dark:border-gray-400 dark:border-t-2">
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
                <FetchstatusIndicator status={props.fetchStatus} />
            </div>
        </div>
    )
}