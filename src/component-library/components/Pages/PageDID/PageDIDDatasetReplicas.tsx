import { DIDDatasetReplicas } from "@/lib/infrastructure/data/view-model/page-did";
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
import { H4 } from "../../Text/Headings/H4";
import { Filter } from "../../StreamedTables/Filter";
import { NumInput } from "../../Input/NumInput";
import { HiChevronDoubleLeft, HiChevronLeft, HiChevronRight, HiChevronDoubleRight, HiSearch, HiCheck, HiDotsHorizontal, HiExternalLink, HiSortAscending, HiSortDescending } from "react-icons/hi"
import { DIDTypeTag } from "../../Tags/DIDTypeTag";
import { DIDType } from "@/lib/core/data/rucio-dto"
import { DateTag } from "../../Tags/DateTag";
import { Number } from "../../Text/Content/Number";
import { AvailabilityTag } from "../../Tags/AvailabilityTag";
import { ReplicaStateTag } from "../../Tags/ReplicaStateTag";
import { ReplicaState } from "@/lib/core/entity/rucio";
import { FetchstatusIndicator } from "../../StreamedTables/FetchstatusIndicator";
import { TextInput } from "../../Input/Input.stories";
import { RSETag } from "../../Tags/RSETag";
import { FullFilter } from "../../StreamedTables/FullFilter";
import { CheckmarkTag } from "../../Tags/CheckmarkTag";
import { BoolTag } from "../../Tags/BoolTag";

type ReducedReplicaState = "Available" | "Unavailable"

const Titletd: React.FC<JSX.IntrinsicElements["td"]> = ({ ...props }) => {
    const { className, ...otherprops } = props
    return (
        <td
            className={twMerge(
                "font-bold w-32 pl-1 dark:text-white",
                className ?? ""
            )}
            {...otherprops}
        >
            {props.children}
        </td>
    )
}
const Contenttd: React.FC<JSX.IntrinsicElements["td"]> = ({ ...props }) => {
    const { className, ...otherprops } = props
    return (
        <td
            className={twMerge(
                "break-all dark:text-gray-100",
                className ?? ""
            )}
            {...otherprops}
        >
            {props.children}
        </td>
    )
}

export const PageDIDDatasetReplicas = (
    props: {
        tableData: TableData<DIDDatasetReplicas>;
    }
) => {
    const tableData = props.tableData
    const columnHelper = createColumnHelper<DIDDatasetReplicas>()
    const columns: any[] = [
        columnHelper.accessor("rse", {
            id: "rse",
            header: (info) => {
                return (
                    <div>
                        should never be shown
                    </div>
                )
            },
            cell: (info) => {
                return (
                    <span
                        className="flex flex-row justify-between md:justify-start md:space-x-1 items-center pl-1"
                    >
                        <RSETag blocked={info.row.original.rseblocked}>
                            <a
                                href={"/rse/" + info.getValue()}
                                target="_blank"
                                rel="noreferrer"
                                className={twMerge(
                                    "dark:text-white",
                                    "hover:underline"
                                )}
                            >
                                {info.getValue()}
                            </a>
                        </RSETag>
                        {info.row.original.availability ? "" : <ReplicaStateTag state={ReplicaState.Unavailable} tiny className="shrink-0 mr-1" />}
                    </span>
                )
            },
            meta: {
                style: "",
                filter: true
            }
        }),
        columnHelper.accessor("rseblocked", { meta: { style: "" } }),
        columnHelper.accessor("availability", { // formerly known as `state`
            id: "availability",
            header: (info) => {
                return (
                    <span
                        className="flex flex-col md:flex-row justify-between items-center pr-1 space-y-1 md:pr-2"
                        onClick={(e) => {
                            // create a match statement for the filter type
                            const filterchange = (filterType: ReducedReplicaState | "none") => {
                                setFilterType(filterType)
                                var column = table.getColumn("availability") as Column<DIDDatasetReplicas, boolean>
                                column.setFilterValue({
                                    "Available": true,
                                    "Unavailable": false,
                                    "none": null,
                                }[filterType])
                            }
                            const nextRecord = {
                                "none": "Available",
                                "Available": "Unavailable",
                                "Unavailable": "none",
                            }
                            filterchange(nextRecord[filterType ?? "null"] as ReducedReplicaState | "none")
                        }}
                    >
                        <H3>Availability</H3>
                        <span className="h-6">
                            {
                                filterType === "none" ? <HiDotsHorizontal className="text-xl text-gray-500 dark:text-gray-200" /> : <ReplicaStateTag state={filterType as ReplicaState} tiny />
                            }
                        </span>
                    </span>
                )
            },
            cell: (info) => {
                return (
                    <ReplicaStateTag
                        state={info.row.original.availability ? ReplicaState.Available : ReplicaState.Unavailable}
                        className="ml-2 md:w-40"
                    />
                )
            },
            meta: {
                style: "cursor-pointer md:w-44 pl-2"
            }
        }),
        columnHelper.accessor("available_files", {
            id: "available_files",
            header: (info) => {
                return (
                    <span
                        className={twMerge(
                            "flex flex-col 2xl:flex-row justify-between items-center space-y-1 2xl:pr-2 2xl:space-y-0"
                        )}
                        onClick={(e) => {
                            // create a match statement for the state filter
                            const sortchange = (sortState: "asc" | "desc" | "none") => {
                                setAvailableFilesSorting(sortState)
                                var column = table.getColumn("available_files") as Column<DIDDatasetReplicas, number>
                                column.toggleSorting()
                            }
                            const nextRecord = {
                                "none": "desc",
                                "desc": "asc",
                                "asc": "none",
                            }
                            sortchange(nextRecord[availableFilesSorting] as "asc" | "desc" | "none")
                        }}
                    >
                        <H4>Available Files</H4>
                        <span className="h-6 text-gray-500 dark:text-gray-200 text-xl">
                            {
                                {
                                    asc: <HiSortAscending />, desc: <HiSortDescending />, none: <HiDotsHorizontal />
                                }[availableFilesSorting]
                            }
                        </span>
                    </span>
                )
            },

            cell: (info) => {
                return (
                    <span
                        className={twMerge(
                            "flex flex-row justify-end pr-2",
                            "font-mono text-right dark:text-white",
                        )}
                    >
                        {info.row.original.available_files}
                    </span>
                )
            },
            meta: {
                style: "cursor-pointer w-36 2xl:w-44 pt-2"
            }
        }),
        columnHelper.accessor("available_bytes", {
            id: "available_bytes",
            header: (info) => {
                return (

                    <span
                        className={twMerge(
                            "flex flex-col 2xl:flex-row justify-between items-center pr-1 space-y-1 2xl:pr-2 2xl:space-y-0"
                        )}
                        onClick={(e) => {
                            // create a match statement for the state filter
                            const sortchange = (sortState: "asc" | "desc" | "none") => {
                                setAvailableBytesSorting(sortState)
                                var column = table.getColumn("available_bytes") as Column<DIDDatasetReplicas, number>
                                column.toggleSorting()
                            }
                            const nextRecord = {
                                "none": "desc",
                                "desc": "asc",
                                "asc": "none",
                            }
                            sortchange(nextRecord[availableBytesSorting] as "asc" | "desc" | "none")
                        }}
                    >
                        <H4>Available Bytes</H4>
                        <span className="h-6 text-gray-500 dark:text-gray-200 text-xl">
                            {
                                {
                                    asc: <HiSortAscending />, desc: <HiSortDescending />, none: <HiDotsHorizontal />
                                }[availableBytesSorting]
                            }
                        </span>
                    </span>
                )
            },
            cell: (info) => {
                return (
                    <span
                        className={twMerge(
                            "flex flex-row justify-end pr-2",
                            "font-mono text-right dark:text-white",
                        )}
                    >
                        <Number number={info.row.original.available_bytes} />
                    </span>
                )
            },
            meta: {
                style: "cursor-pointer w-36 2xl:w-44 pt-2"
            }
        }),
        columnHelper.accessor("creation_date", {
            id: "creation_date",
            header: (info) => {
                return (
                    <span
                        className={twMerge(
                            "flex flex-col 2xl:flex-row justify-between items-center space-y-1 2xl:pr-2 2xl:space-y-0"
                        )}
                        onClick={(e) => {
                            // create a match statement for the state filter
                            const sortchange = (sortState: "asc" | "desc" | "none") => {
                                setCreationDateSorting(sortState)
                                var column = table.getColumn("creation_date") as Column<DIDDatasetReplicas, Date>
                                column.toggleSorting()
                            }
                            const nextRecord = {
                                "none": "desc",
                                "desc": "asc",
                                "asc": "none",
                            }
                            sortchange(nextRecord[creationDateSorting] as "asc" | "desc" | "none")
                        }}
                    >
                        <H4>Creation Date</H4>
                        <span className="h-6 text-gray-500 dark:text-gray-200 text-xl">
                            {
                                {
                                    asc: <HiSortAscending />, desc: <HiSortDescending />, none: <HiDotsHorizontal />
                                }[creationDateSorting]
                            }
                        </span>
                    </span>
                )
            },
            cell: (info) => {
                return (
                    <span
                        className={twMerge(
                            "flex flex-row justify-end pr-2",
                            "font-mono text-right dark:text-white",
                        )}
                    >
                        <DateTag date={info.row.original.creation_date} />
                    </span>
                )
            },
            meta: {
                style: "cursor-pointer w-36 2xl:w-44 pt-2"
            }
        }),
        columnHelper.accessor("last_accessed", {
            id: "last_accessed",
            header: (info) => {
                return (
                    <span
                        className={twMerge(
                            "flex flex-col 2xl:flex-row justify-between items-center space-y-1 2xl:pr-2 2xl:space-y-0"
                        )}
                        onClick={(e) => {
                            // create a match statement for the state filter
                            const sortchange = (sortState: "asc" | "desc" | "none") => {
                                setAccessedDateSorting(sortState)
                                var column = table.getColumn("last_accessed") as Column<DIDDatasetReplicas, Date>
                                column.toggleSorting()
                            }
                            const nextRecord = {
                                "none": "desc",
                                "desc": "asc",
                                "asc": "none",
                            }
                            sortchange(nextRecord[accessedDateSorting] as "asc" | "desc" | "none")
                        }}
                    >
                        <H4>Last Accessed</H4>
                        <span className="h-6 text-gray-500 dark:text-gray-200 text-xl">
                            {
                                {
                                    asc: <HiSortAscending />, desc: <HiSortDescending />, none: <HiDotsHorizontal />
                                }[accessedDateSorting]
                            }
                        </span>
                    </span>
                )
            },
            cell: (info) => {
                return (
                    <span
                        className={twMerge(
                            "flex flex-row justify-end pr-2",
                            "font-mono text-right dark:text-white",
                        )}
                    >
                        <DateTag date={info.row.original.last_accessed} />
                    </span>
                )
            },
            meta: {
                style: "cursor-pointer w-36 2xl:w-44 pt-2"
            }
        }),
    ]

    // handle window resize
    const [windowSize, setWindowSize] = useState([
        1920, 1080
    ]);

    const table = useReactTable<DIDDatasetReplicas>({
        data: tableData.data || [],
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
        state: {
            columnVisibility: {
                rse: true,
                availability: false,
                available_files: windowSize[0] > 1024,
                available_bytes: windowSize[0] > 1024,
                creation_date: windowSize[0] > 1024,
                last_accessed: windowSize[0] > 1024,
                rseblocked: false
            }
        }
    } as TableOptions<DIDDatasetReplicas>)

    const [selectedRSE, setSelectedRSE] = useState<DIDDatasetReplicas | null>(null)

    // Filter by DID Type
    const [filterType, setFilterType] = useState<"Available" | "Unavailable" | "none">("none")
    const [availableFilesSorting, setAvailableFilesSorting] = useState<"asc" | "desc" | "none">("none")
    const [availableBytesSorting, setAvailableBytesSorting] = useState<"asc" | "desc" | "none">("none")
    const [creationDateSorting, setCreationDateSorting] = useState<"asc" | "desc" | "none">("none")
    const [accessedDateSorting, setAccessedDateSorting] = useState<"asc" | "desc" | "none">("none")


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
                            "w-full flex-row sticky top-0 bg-white dark:bg-gray-700 shadow-md dark:shadow-none h-16 md:h-14"
                        )}
                    >
                        {
                            table.getLeafHeaders().map((header) => {
                                return (
                                    <th key={header.id} className={(header.column.columnDef as StyleMetaColumnDef<DIDDatasetReplicas>).meta.style}>
                                        {(header.column.columnDef as StyleMetaColumnDef<DIDDatasetReplicas>).meta.filter ?? false ? (
                                            <FullFilter columnTitle="RSE" column={header.column} table={table} className="pl-1" />
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
                                    "w-full hover:cursor-pointer lg:hover:cursor-normal h-16 md:h-8",
                                    "bg-white odd:bg-stone-100",
                                    "dark:bg-gray-700 dark:odd:bg-gray-800",
                                    "hover:bg-gray-200 dark:hover:bg-gray-900",
                                )}
                                onClick={() => {
                                    if (windowSize[0] > 1024) return
                                    setSelectedRSE(row.original)
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
            <div
                className={twMerge(
                    "block lg:hidden",
                    "mx-2 rounded",
                    "bg-stone-100"
                )}
            >
                <table>
                    <tbody>
                        <tr>
                            <Titletd>
                                RSE Name
                            </Titletd>
                            <Contenttd>{selectedRSE?.rse ?? "None"}</Contenttd>
                        </tr>
                        <tr>
                            <Titletd>
                                Availability
                            </Titletd>
                            <Contenttd>
                                <BoolTag val={selectedRSE?.availability ?? false} />
                            </Contenttd>
                        </tr>
                        <tr>
                            <Titletd>
                                Available Files
                            </Titletd>
                            <Contenttd>{selectedRSE?.available_files ?? 0}</Contenttd>
                        </tr>
                        <tr>
                            <Titletd>
                                Available Bytes
                            </Titletd>
                            <Contenttd>
                                <Number number={selectedRSE?.available_bytes ?? 0} />
                            </Contenttd>
                        </tr>
                        <tr>
                            <Titletd>
                                Creation Date
                            </Titletd>
                            <Contenttd>
                                <DateTag date={selectedRSE?.creation_date ?? new Date()} />
                            </Contenttd>
                        </tr>
                        <tr>
                            <Titletd>
                                Last Accessed
                            </Titletd>
                            <Contenttd>
                                <DateTag date={selectedRSE?.last_accessed ?? new Date()} />
                            </Contenttd>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
};
