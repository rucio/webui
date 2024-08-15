import { StreamedTable } from "@/component-library/StreamedTables/StreamedTable"
import { TransferStatsViewModel } from "@/lib/infrastructure/data/view-model/request-stats"
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM"
import { Heading } from "../Helpers/Heading"
import { createColumnHelper } from "@tanstack/react-table"
import { Body } from "../Helpers/Body"
import { RequestState } from "@/lib/core/entity/rucio"
import { TableFilterDiscrete } from "@/component-library/StreamedTables/TableFilterDiscrete"
import { RequestStateTag } from "@/component-library/Tags/RequestStateTag"
import { HiDotsHorizontal } from "react-icons/hi"

export const ListTransferStatistics = (
    props: {
        comdom: UseComDOM<TransferStatsViewModel>
    }
) => {
    const columnHelper = createColumnHelper<TransferStatsViewModel>()
    const tablecolumns = [
        columnHelper.accessor("source_rse", {}),
        columnHelper.accessor("dest_rse", {}),
        columnHelper.accessor("activity", {}),
        columnHelper.accessor("state", {
            id: "state",
            header: info => {
                return (
                    <TableFilterDiscrete<RequestState>
                        name="Request Type"
                        keys={Object.values(RequestState)}
                        renderFunc={key => key === undefined ? <HiDotsHorizontal className="text-2xl text-gray-500 dark:text-gray-200" /> : <RequestStateTag state={key} forcesmall />}
                        column={info.column}
                        stack
                    />
                )
            },
            cell: info => <RequestStateTag state={info.getValue()} />,
            meta: {
                style: "w-8 md:w-32"
            }
        }),
        columnHelper.accessor("activity", {}),
        columnHelper.accessor("counter", {}),
        columnHelper.accessor("bytes", {}),
    ]

    return (
        <div>
            <Heading
                title="Transfer Statistics"
            />
            <Body>
                <StreamedTable<TransferStatsViewModel>
                    tablecomdom={props.comdom}
                    tablecolumns={tablecolumns}
                    tablestyling={{
                        tableHeadRowStyle: "md:h-16",
                        visibility: {}
                    }}
                />
            </Body>
        </div>
    )
}