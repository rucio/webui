// components
import { Button } from "../../Button/Button";
import { P } from "../../Text/Content/P";
import { H3 } from "../../Text/Headings/H3";
import { Filter } from "../../StreamedTables/Filter";
import { NumInput } from "../../Input/NumInput";
import { BoolTag } from "../../Tags/BoolTag";
import { AvailabilityTag } from "../../Tags/AvailabilityTag";
import { DIDTypeTag } from "../../Tags/DIDTypeTag";
import { DateTag } from "../../Tags/DateTag";
import { NullTag } from "../../Tags/NullTag";
import { FetchstatusIndicator } from "../../StreamedTables/FetchstatusIndicator";
import { PageDIDFilereplicas } from "./PageDIDFilereplicas";
import { PaginationDiv } from "../../StreamedTables/PaginationDiv";

// misc packages, react
import { useEffect, useState } from "react"
import { createColumnHelper, useReactTable, TableOptions, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, Column, flexRender } from "@tanstack/react-table"
import { twMerge } from "tailwind-merge"
import { FetchStatus } from "@tanstack/react-query";
import { HiChevronDoubleLeft, HiChevronLeft, HiChevronRight, HiChevronDoubleRight, HiSearch, HiCheck, HiDotsHorizontal, HiExternalLink } from "react-icons/hi"

// Viewmodels etc
import { RSE, ReplicaState, DIDType } from "@/lib/core/entity/rucio";
import { ReplicaStateTag } from "../../Tags/ReplicaStateTag";
import { TableData } from "@/lib/infrastructure/data/view-model/streamedtables";
import { FilereplicaStateD } from "@/lib/infrastructure/data/view-model/page-did";
import { FilereplicaState } from "@/lib/infrastructure/data/view-model/page-did";



export const PageDIDFilereplicasD = (
    props: {
        datasetTableData: TableData<FilereplicaStateD>,
        replicaTableData: TableData<FilereplicaState>,
        onChangeDatasetSelection: (selected: string) => void,
    }
) => {
    const { datasetTableData, replicaTableData, onChangeDatasetSelection } = props
    const columnHelper = createColumnHelper<FilereplicaStateD>()
    const columns: any[] = [
        columnHelper.accessor(row => `${row.scope}:${row.name}`, {
            id: "did",
            cell: (info) => {
                return (
                    <span
                        className={twMerge(
                            "flex flex-row justify-space-between space-x-2 items-center",
                        )}
                    >
                        <span className="flex flex-row justify-start space-x-2 items-center">
                            <p
                                className={twMerge(
                                    "pl-2",
                                    "dark:text-gray-100",
                                    "break-all"
                                )}
                            >
                                {info.getValue()}
                            </p>
                            <a
                                href={"/rse/" + info.getValue()}
                                className={twMerge(
                                    "text-gray-600 hover:text-blue-600",
                                    "dark:text-gray-400 dark:hover:text-blue-400",
                                    "pr-1"
                                )}
                            >
                                <HiExternalLink className="text-l" />
                            </a>
                        </span>
                    </span>
                )
            }
        }),
    ]

    const table = useReactTable<FilereplicaStateD>({
        data: datasetTableData.data || [],
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
    } as TableOptions<FilereplicaStateD>)

    // most important part: selecting DIDs (rows)
    // this is handled OUTSIDE of tanstack
    const [selectedDID, setSelectedDID] = useState<string | null>(null)
    // run onChangeDatasetSelection when selectedDID changes
    useEffect(() => {
        props.onChangeDatasetSelection(selectedDID as string)
    }, [selectedDID])

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
        table.setPageSize(datasetTableData.pageSize)
    }, [datasetTableData.pageSize])

    return (
        <div className="pt-1">
            <i>Select a file and view the states of its replicas.</i>
            <div
                className={twMerge(
                    "xl:grid xl:grid-cols-2 xl:gap-4 xl:pt-1",
                )}
            >
                <div
                    className={twMerge(
                        "border dark:border-gray-200 dark:border-2 rounded-md",
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
                                            <DIDTypeTag didtype={DIDType.File} className="h-8 text-xl" neversmall />
                                        </span>
                                        <span className="hidden sm:flex w-full">
                                            <Filter column={table.getColumn("did") as Column<FilereplicaStateD, unknown>} table={table} placeholder="Filter Files by DID" />
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
                                        <Filter column={table.getColumn("did") as Column<FilereplicaStateD, unknown>} table={table} placeholder="Filter Files by DID" />
                                        <button
                                            onClick={(e) => { setSmallScreenNameFiltering(!smallScreenNameFiltering) }}
                                        >
                                            <HiCheck className="text-xl text-gray-500 dark:text-gray-200" />
                                        </button>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="w-full">
                            {table.getRowModel().rows.map((row) => {
                                const isSelected = row.getValue("did") === selectedDID
                                return (
                                    <tr
                                        key={row.id}
                                        className={twMerge(
                                            "w-full hover:cursor-pointer h-16 md:h-8",
                                            "bg-white odd:bg-stone-100",
                                            "dark:bg-gray-700 dark:odd:bg-gray-800",
                                            isSelected ? "bg-blue-200 odd:bg-blue-200 hover:bg-blue-300 dark:bg-blue-500 odd:dark:bg-blue-500 dark:hover:bg-blue-600 border border-blue-400 dark:border-blue-700" :
                                                "hover:bg-gray-200 dark:hover:bg-gray-900",
                                        )}
                                        onClick={(event) => {
                                            setSelectedDID(row.getValue("did"))
                                        }}
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
                    <PaginationDiv table={table}/>
                    <div
                        className={twMerge(
                            "absolute",
                            "top-16 sm:top-12 right-2",
                        )}
                    >
                        <FetchstatusIndicator status={datasetTableData.fetchStatus} />
                    </div>
                </div>
                <PageDIDFilereplicas tableData={replicaTableData}/>
            </div>
        </div>
    )
}