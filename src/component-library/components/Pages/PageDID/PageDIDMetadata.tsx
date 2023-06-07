// components
import { Button } from "../../Button/Button";
import { P } from "../../Text/Content/P";
import { H3 } from "../../Text/Headings/H3";
import { Filter } from "../../StreamedTables/Filter";
import { NumInput } from "../../Input/NumInput";
import { BoolTag } from "../../Tags/BoolTag";
import { AvailabilityTag } from "../../Tags/AvailabilityTag";
import { DIDTypeTag } from "../../Tags/DIDTypeTag";
import { DIDType } from "@/lib/core/entity/rucio";
import { DateTag } from "../../Tags/DateTag";
import { NullTag } from "../../Tags/NullTag";
import { FetchstatusIndicator } from "../../StreamedTables/FetchstatusIndicator";
import { PaginationDiv } from "../../StreamedTables/PaginationDiv";
import { StreamedTable } from "../../StreamedTables/StreamedTable";

// misc packages, react
import { useEffect, useState } from "react"
import { createColumnHelper, useReactTable, TableOptions, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, Column, flexRender } from "@tanstack/react-table"
import { twMerge } from "tailwind-merge"
import { FetchStatus } from "@tanstack/react-query";
import { HiChevronDoubleLeft, HiChevronLeft, HiChevronRight, HiChevronDoubleRight, HiSearch, HiCheck, HiDotsHorizontal, HiExternalLink } from "react-icons/hi"

// Viewmodels etc
import { DIDAvailability } from "@/lib/core/entity/rucio"
import { DIDKeyValuePairs } from "@/lib/infrastructure/data/view-model/page-did";
import { TableData } from "@/lib/infrastructure/data/view-model/streamedtables";
import { TableFilterString } from "../../StreamedTables/TableFilterString";

export const PageDIDMetadata = (
    props: {
        tableData: TableData<DIDKeyValuePairs> // remember that this is ONLY the custom metadata
    }
) => {
    const tableData = props.tableData

    const columnHelper = createColumnHelper<DIDKeyValuePairs>()
    const tablecolumns: any[] = [
        columnHelper.accessor("key", {
            id: "key",
            cell: (info) => {
                return (
                    <span className={twMerge("dark:text-white")}>
                        {info.getValue()}
                    </span>
                )
            },
            header: info => {
                return (
                    <TableFilterString
                        column={info.column}
                        name="Key"
                    />
                )
            }
        }
        ),
        columnHelper.accessor("value", {
            id: "value",
            cell: (info) => {
                const val = info.getValue()
                if (typeof (val) === "boolean") {
                    return <BoolTag val={val} />
                }
                if (val === null) {
                    return <NullTag />
                }
                if (val instanceof Date) {
                    return <DateTag date={val} dateFormat="yyyy-MM-dd hh:mm:ss" />
                }
                if (["Available", "Deleted", "Lost"].includes(val as string)) {
                    return <AvailabilityTag availability={val as DIDAvailability} />
                }
                if (Object.values(DIDType).includes(val as DIDType)) {
                    return <DIDTypeTag didtype={val as DIDType} />
                }
                else {
                    return <span className="dark:text-white">{val as string}</span>
                }
            },
            header: info => {
                return (
                    <H3 className="text-left">Value</H3>
                )
            }
        })
    ]

    return (
        <StreamedTable<DIDKeyValuePairs>
            tabledata={tableData}
            tablecolumns={tablecolumns}
            tablestyling={{}}
        />
    )
}