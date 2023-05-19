import { StyleMetaColumnDef, TableData } from "@/lib/infrastructure/data/view-model/streamedtables";
import { DIDContents, DIDParents } from "@/lib/infrastructure/data/view-model/page-did";
import { twMerge } from "tailwind-merge";
import { FetchStatus } from "@tanstack/react-query"
import { createColumnHelper, useReactTable, TableOptions, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, Column, flexRender } from "@tanstack/react-table"
import { useEffect, useState } from "react"

import { PaginationDiv } from "../../StreamedTables/PaginationDiv";
import { Button } from "../../Button/Button";
import { P } from "../../Text/Content/P";
import { H3 } from "../../Text/Headings/H3";
import { Filter } from "../../StreamedTables/Filter";
import { NumInput } from "../../Input/NumInput";
import { HiChevronDoubleLeft, HiChevronLeft, HiChevronRight, HiChevronDoubleRight, HiSearch, HiCheck, HiDotsHorizontal, HiExternalLink } from "react-icons/hi"
import { DIDTypeTag } from "../../Tags/DIDTypeTag";
import { FetchstatusIndicator } from "../../StreamedTables/FetchstatusIndicator"
import { DIDType } from "@/lib/core/data/rucio-dto"
import { FullFilter } from "../../StreamedTables/FullFilter";

export const PageDIDContents = (
    props: {
        tableData: TableData<DIDContents>,
        showDIDType?: boolean,
    }
) => {
    const tableData = props.tableData
    const columnHelper = createColumnHelper<DIDContents>()
    const columns: any[] = [
        columnHelper.accessor(row => `${row.scope}:${row.name}`, {
            id: "did",
            cell: (info) => {
                return (
                    <span className="flex flex-row justify-start space-x-2 items-center">
                        <p
                            className={twMerge(
                                "pl-2 select-all break-all",
                                "dark:text-gray-100"
                            )}
                        >
                            {info.getValue()}
                        </p>
                        <a
                            href={"/pagedid/" + info.getValue()}
                            className={twMerge(
                                "text-gray-600 hover:text-blue-600",
                                "dark:text-gray-400 dark:hover:text-blue-400",
                                "pr-1"
                            )}
                        >
                            <HiExternalLink className="text-l" />
                        </a>
                    </span>
                )
            },
            header: (info) => {
                return (
                    <p>Should not be visible</p>
                )
            },
            meta: {
                style: "grow pl-2",
                filter: true
            }
        }),
        columnHelper.accessor("did_type", {
            id: "did_type",
            cell: (info) => {
                return (
                    <span
                        className={twMerge(
                            "flex flex-row justify-center",
                        )}
                    >
                        <DIDTypeTag didtype={info.getValue()} />
                    </span>
                )
            },
            header: (info) => {
                return (
                    <div
                        onClick={(e) => {
                            // create a match statement for the filter type
                            const filterchange = (filterType: DIDType | undefined) => {
                                setFilterType(filterType)
                                var column = table.getColumn("did_type") as Column<DIDContents, unknown>
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
                        className="w-full"
                    >
                        <span
                            className={twMerge(
                                "flex flex-col items-center space-y-1",
                                "md:flex-row md:space-y-0 md:space-x-2 md:items-end md:justify-between",
                            )}
                        >
                            <H3>Type</H3>
                            <span className="h-6 md:pr-1">
                                {
                                    filterType === undefined ? <HiDotsHorizontal className={twMerge("text-2xl text-gray-500 dark:text-gray-200 md:pt-1")} /> : <DIDTypeTag didtype={filterType} forcesmall />
                                }
                            </span>
                        </span>
                    </div>
                )
            },
            meta: {
                style: "w-16 md:w-28 flex-none hover:cursor-pointer select-none",
            }
        })
    ]
    const table = useReactTable<DIDContents>({
        data: tableData.data || [],
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
        state: {
            columnVisibility: {
                did: true,
                did_type: props.showDIDType ?? false,
            }
        }
    } as TableOptions<DIDContents>)

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

    // Pagination
    const [pageIndex, setPageIndex] = useState(table.getState().pagination.pageIndex)
    useEffect(() => {
        setPageIndex(table.getState().pagination.pageIndex)
    }, [table.getState().pagination.pageIndex])
    useEffect(() => {
        table.setPageIndex(pageIndex)
    }, [pageIndex])
    useEffect(() => {
        table.setPageSize(tableData.pageSize)
    }, [tableData.pageSize])

    return (
        <div
            className={twMerge(
                "border dark:border-gray-200 dark:border-2 rounded-md",
                tableData.fetchStatus === "fetching" ? "hover:cursor-wait" : "",
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
                            "w-full flex-row sticky top-0 bg-white dark:bg-gray-700 shadow-md dark:shadow-none h-16 md:h-12"
                        )}
                    >
                        {
                            table.getLeafHeaders().map((header) => {
                                return (
                                    <th key={header.id} className={(header.column.columnDef as StyleMetaColumnDef<DIDContents>).meta.style}>
                                        {(header.column.columnDef as StyleMetaColumnDef<DIDContents>).meta.filter ?? false ? (
                                            <FullFilter columnTitle="DID" column={header.column} table={table}/>
                                        ) : (
                                            flexRender(header.column.columnDef.header, header.getContext())
                                        )}
                                    </th>
                                )
                            })
                        }

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
            <PaginationDiv table={table} pageIndex={pageIndex} setPageIndex={setPageIndex} />
            <div
                className={twMerge(
                    "absolute",
                    "top-16 sm:top-12 right-2",
                    "pointer-events-none"
                )}
            >
                <FetchstatusIndicator status={tableData.fetchStatus} />
            </div>
        </div>
    )
};
