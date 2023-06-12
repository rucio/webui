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
import { StreamedTable } from "../../StreamedTables/StreamedTable";
import { TableFilterString } from "../../StreamedTables/TableFilterString";



export const PageDIDFilereplicasD = (
    props: {
        datasetTableData: TableData<FilereplicaStateD>,
        replicaTableData: TableData<FilereplicaState>,
        onChangeDatasetSelection: (selected: string) => void,
    }
) => {
    const { datasetTableData, replicaTableData, onChangeDatasetSelection } = props
    const columnHelper = createColumnHelper<FilereplicaStateD>()
    const tablecolumns: any[] = [
        columnHelper.accessor(row => `${row.scope}:${row.name}`, {
            id: "did",
            header: info => {
                return (
                    <TableFilterString
                        column={info.column}
                        name="File"
                    />
                )
            },
            cell: info => {
                return (
                    <P>{info.getValue()}</P>
                )
            }
        }),
    ]

    return (
        <div className="pt-1">
            <i>Select a file and view the states of its replicas.</i>
            <div
                className={twMerge(
                    "xl:grid xl:grid-cols-2 xl:gap-4 xl:pt-1",
                )}
            >
                <StreamedTable
                    tabledata={datasetTableData}
                    tablecolumns={tablecolumns}
                    tablestyling={{}}
                    tableselecting={{
                        handleChange: (data: FilereplicaStateD[]) => { console.info(data) },
                        enableRowSelection: true,
                        enableMultiRowSelection: false
                    }}
                />
                <PageDIDFilereplicas tableData={replicaTableData} />
            </div>
        </div>
    )
}