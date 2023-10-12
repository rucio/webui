import { DIDType, Request, RequestState, RequestType } from "@/lib/core/entity/rucio";
import { BaseViewModel } from "@/lib/sdk/view-models";

export interface TransferViewModel extends BaseViewModel, Request {}

/**
 * A utility function to retrieve an empty {@link TransferViewModel}.
 * @return an empty TransferViewModel
 */
export function getEmptyTransferViewModel(): TransferViewModel {
    const viewModel: TransferViewModel = {
        status: 'error',
        id: '',
        request_type: RequestType.TRANSFER,
        scope: '',
        name: '',
        did_type: DIDType.UNKNOWN,
        dest_rse_id: '',
        source_rse_id: '',
        attributes: '',
        state: RequestState.FAILED,
        activity: '',
        bytes: 0,
        account: '',
        requested_at: '',
        priority: 0,
        transfertool: '',
        source_rse: '',
        dest_rse: '',
    }
    return viewModel
}