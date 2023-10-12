import { StreamedTable } from "@/component-library/StreamedTables/StreamedTable"
import { TransferStatsViewModel } from "@/lib/infrastructure/data/view-model/request-stats"
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM"
import { Heading } from "../Helpers/Heading"
import { createColumnHelper } from "@tanstack/react-table"
import { Body } from "../Helpers/Body"
import { Contenttd, Generaltable, Titleth } from "@/component-library/Helpers/Metatable"
import { H3 } from "@/component-library/Text/Headings/H3"
import { TransferStatistics } from "./TransferStatistics"

export const ListTransferStatistics = (
    props: {
        comdom: UseComDOM<TransferStatsViewModel>
    }
) => {
    const columnHelper = createColumnHelper<TransferStatsViewModel>()
    const tablecolumns = [
        columnHelper.accessor("source_rse", {
        }),
        columnHelper.accessor("dest_rse", {
        }),
        columnHelper.accessor("request_stats", {
            id: "request_stats",
            header: info => <H3>Transfer Statistics</H3>,
            cell: info => {
                return <TransferStatistics request_stats={info.getValue()} />
            }
        })
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