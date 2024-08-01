import { RequestState, RequestStats } from "@/lib/core/entity/rucio";
import { BaseViewModel } from "@/lib/sdk/view-models";

export interface TransferStatsViewModel extends BaseViewModel, RequestStats {}

export function generateEmptyTransferStatsViewModel(): TransferStatsViewModel {
    return {
        status: 'error',
        account: '',
        source_rse: '',
        dest_rse: '',
        source_rse_id: '',
        dest_rse_id: '',
        state: RequestState.FAILED,
        activity: '',
        counter: 0,
        bytes: 0,
    }
}
