import { DIDContents } from "@/lib/infrastructure/data/view-model/page-did";
import { twMerge } from "tailwind-merge";
import { createColumnHelper } from "@tanstack/react-table"

import { P } from "../../Text/Content/P";
import { DIDTypeTag } from "../../Tags/DIDTypeTag";
import { DIDType } from "@/lib/core/entity/rucio"
import { StreamedTable } from "../../StreamedTables/StreamedTable";
import { TableFilterString } from "../../StreamedTables/TableFilterString";
import { TableFilterDiscrete } from "../../StreamedTables/TableFilterDiscrete";
import { HiDotsHorizontal } from "react-icons/hi"
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";

export const PageDIDByType = (
    props: {
        comdom: UseComDOM<DIDContents>,
        showDIDType?: boolean,
    }
) => {
    const columnHelper = createColumnHelper<DIDContents>()
    const tablecolumns: any[] = [
        columnHelper.accessor(row => `${row.scope}:${row.name}`, {
            id: "did",
            header: info => {
                return (
                    <TableFilterString
                        column={info.column}
                        name="DID"
                    />
                )
            },
            cell: info => {
                return (
                    <P className="break-all pr-1">{info.getValue()}</P>
                )
            }
        }),
        columnHelper.accessor("did_type", {
            id: "did_type",
            header: info => {
                return (
                    <TableFilterDiscrete<DIDType>
                        name="DID Type"
                        keys={[DIDType.Container, DIDType.Dataset, DIDType.File]}
                        renderFunc={state => state === undefined ? <HiDotsHorizontal className="text-2xl text-gray-500 dark:text-gray-200" /> : <DIDTypeTag didtype={state} forcesmall/>}
                        column={info.column}
                    />
                )
            },
            cell: info => <DIDTypeTag didtype={info.getValue()}/>,
            meta: {
                style: "w-6 sm:w-8 md:w-36"
            }
        }),
    ]

    return (
        <StreamedTable
            tablecomdom={props.comdom}
            tablecolumns={tablecolumns}
            tablestyling={{}}
        />
    )
};
