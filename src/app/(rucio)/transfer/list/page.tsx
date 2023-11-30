import { ListTransferStatistics as ListTransferStatisticsStory } from "@/component-library/Pages/Transfers/ListTransferStatistics";
import { TransferStatsViewModel } from "@/lib/infrastructure/data/view-model/request-stats";
import useComDOM from "@/lib/infrastructure/hooks/useComDOM";
import { HTTPRequest } from "@/lib/sdk/http";

export default function Page() {
    const TransferStatsSearchComDOM = useComDOM<TransferStatsViewModel>(
        'list-transfer-stats-query',
        [],
        false,
        Infinity,
        200,
        true
    )
    return (
        <ListTransferStatisticsStory
            comdom={TransferStatsSearchComDOM}
        />
    )
}