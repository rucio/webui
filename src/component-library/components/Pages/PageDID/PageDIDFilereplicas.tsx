// components
import { TableFilterDiscrete } from "../../StreamedTables/TableFilterDiscrete";

// misc packages, react
import { createColumnHelper} from "@tanstack/react-table"
import { twMerge } from "tailwind-merge"
import { HiDotsHorizontal } from "react-icons/hi"

// Viewmodels etc
import { ReplicaState } from "@/lib/core/entity/rucio";
import { ReplicaStateTag } from "../../Tags/ReplicaStateTag";
import { TableData } from "@/lib/infrastructure/data/view-model/streamedtables";
import { FilereplicaState } from "@/lib/infrastructure/data/view-model/page-did";
import { StreamedTable } from "../../StreamedTables/StreamedTable";
import { TableFilterString } from "../../StreamedTables/TableFilterString";


export const PageDIDFilereplicas = (
    props: {
        tableData: TableData<FilereplicaState>,
    }
) => {
    const tableData = props.tableData
    const columnHelper = createColumnHelper<FilereplicaState>()
    const tablecolumns: any[] = [
        columnHelper.accessor("rse", {
            id: "rse",
            cell: (info) => {
                // perhaps use this as a basis for links in tables
                return (
                    <a
                        href={"/rse/" + info.getValue()}
                        className={twMerge(
                            "pl-1",
                            "break-all",
                            "hover:underline",
                            "hover:text-blue-600",
                            "dark:text-white dark:hover:text-blue-400",
                        )}
                    >
                        {info.getValue()}
                    </a>
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
        <StreamedTable<FilereplicaState>
            tabledata={tableData}
            tablecolumns={tablecolumns}
            tablestyling={{}}
        />
    )
}