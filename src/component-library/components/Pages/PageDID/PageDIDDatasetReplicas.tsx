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
import { StreamedTable } from "../../StreamedTables/StreamedTable";
import { TableFilterString } from "../../StreamedTables/TableFilterString";
import { TableSortUpDown } from "../../StreamedTables/TableSortUpDown";

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
    const columnHelper = createColumnHelper<DIDDatasetReplicas>()
    const tablecolumns: any[] = [
        columnHelper.accessor("rse", {
            id: "rse",
            header: info => {
                return (
                    <TableFilterString
                        column={info.column}
                        name="RSE"
                    />
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
            header: info => {
                return (
                    <TableSortUpDown
                        name="Available Files"
                        column={info.column}
                        stack
                    />
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
                style: "cursor-pointer w-40 2xl:w-44 pt-2"
            }
        }),
        columnHelper.accessor("available_bytes", {
            id: "available_bytes",
            header: info => {
                return (
                    <TableSortUpDown
                        name="Available Bytes"
                        column={info.column}
                        stack
                    />
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
                style: "cursor-pointer w-40 2xl:w-44 pt-2"
            }
        }),
        columnHelper.accessor("creation_date", {
            id: "creation_date",
            header: info => {
                return (
                    <TableSortUpDown
                        name="Creation Date"
                        column={info.column}
                        stack
                    />
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
                style: "cursor-pointer w-40 2xl:w-44 pt-2"
            }
        }),
        columnHelper.accessor("last_accessed", {
            id: "last_accessed",
            header: info => {
                return (
                    <TableSortUpDown
                        name="Last Accessed"
                        column={info.column}
                        stack
                    />
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
                style: "cursor-pointer w-40 2xl:w-44 pt-2"
            }
        }),
    ]

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
    const isLg = () => windowSize[0] > 1024 // 1024px is the breakpoint for lg => is minimum lg sized


    return (
        <StreamedTable
            tabledata={props.tableData}
            tablecolumns={tablecolumns}
            tablestyling={{
                visibility: {
                    "rse": true,
                    "availability": false,
                    "available_files": isLg(),
                    "available_bytes": isLg(),
                    "creation_date": isLg(),
                    "last_accessed": isLg(),
                    "rseblocked": false
                } 
            }}
            tableselecting={{
                handleChange: (data: DIDDatasetReplicas[]) => {},
                enableRowSelection: !isLg(),
                breakOut: {
                    breakoutVisibility: !isLg(),
                    keys: {
                        "available_files": "Available Files",
                        "available_bytes": "Available Bytes",
                        "creation_date": "Creation Date",
                        "last_accessed": "Last Accessed",
                    }
                }
            }}
        />
    )
};
