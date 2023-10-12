import { NormalTable } from "@/component-library/StreamedTables/NormalTable"
import { TableStyling } from "@/component-library/StreamedTables/types"
import { RequestStatsPerPair } from "@/lib/core/entity/rucio"
import { createColumnHelper } from "@tanstack/react-table"

export const TransferStatistics = (
    props: {
        request_stats: RequestStatsPerPair[]
    }
) => {
    const columnHelper = createColumnHelper<RequestStatsPerPair>()
    const tablecolumns: any[] = [
        columnHelper.accessor("activity", {}),
        columnHelper.accessor("counter", {}),
        columnHelper.accessor("bytes", {}),
    ]
    return (
        <NormalTable<RequestStatsPerPair>
            tabledata={props.request_stats}
            tablecolumns={tablecolumns}
            tablestyling={{
                pageSize: 5
            } as TableStyling}
        />
    )
}