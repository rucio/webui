// components
import { TableFilterDiscrete } from "../../StreamedTables/TableFilterDiscrete";

// misc packages, react
import { createColumnHelper } from "@tanstack/react-table"
import { twMerge } from "tailwind-merge"
import { HiDotsHorizontal } from "react-icons/hi"

// Viewmodels etc
import { ReplicaState } from "@/lib/core/entity/rucio";
import { ReplicaStateTag } from "../../Tags/ReplicaStateTag";
import { StreamedTable } from "../../StreamedTables/StreamedTable";
import { TableFilterString } from "../../StreamedTables/TableFilterString";
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";
import { TableInternalLink } from "../../StreamedTables/TableInternalLink";
import { FilereplicaStateViewModel } from "@/lib/infrastructure/data/view-model/did";
import { TableStyling } from "@/component-library/StreamedTables/types";


export const PageDIDFilereplicas = (
    props: {
        comdom: UseComDOM<FilereplicaStateViewModel>,
        tablestyling?: TableStyling,
    }
) => {
    const columnHelper = createColumnHelper<FilereplicaStateViewModel>()
    const tablecolumns: any[] = [
        columnHelper.accessor("rse", {
            id: "rse",
            cell: (info) => {
                // perhaps use this as a basis for links in tables
                return (
                    <TableInternalLink href={"/rse/page/" + info.getValue()}>
                        {info.getValue()}
                    </TableInternalLink>
                )
            },
            header: info => {
                return (
                    <TableFilterString
                        name="RSE"
                        column={info.column}
                    />
                )
            },
            filterFn: "includesString",
        }
        ),
        columnHelper.accessor("state", {
            id: "state",
            cell: (info) => {
                return (
                    <ReplicaStateTag state={info.getValue()} />
                )
            },
            header: info => {
                return (
                    <TableFilterDiscrete<ReplicaState>
                        name="File Replica State"
                        keys={Object.values(ReplicaState)}
                        renderFunc={key => key === undefined ? <HiDotsHorizontal className="text-2xl text-gray-500 dark:text-gray-200" /> : <ReplicaStateTag state={key} tiny />}
                        column={info.column}
                    />
                )
            },
            filterFn: "equalsString",
            meta: {
                style: "w-28 md:w-56"
            }
        })
    ]
    return (
        <StreamedTable<FilereplicaStateViewModel>
            tablecomdom={props.comdom}
            tablecolumns={tablecolumns}
            tablestyling={props.tablestyling ?? {}}
        />
    )
}