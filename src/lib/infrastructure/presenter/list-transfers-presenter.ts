import { ListTransfersOutputPort } from "@/lib/core/port/primary/list-transfers-ports";
import { ListTransfersError, ListTransfersResponse } from "@/lib/core/usecase-models/list-transfers-usecase-models";
import { BaseStreamingPresenter } from "@/lib/sdk/presenter";
import { NextApiResponse } from "next";
import { getEmptyTransferViewModel, TransferViewModel } from "../data/view-model/request";

export default class ListTransfersPresenter extends BaseStreamingPresenter<ListTransfersResponse, ListTransfersError, TransferViewModel> implements ListTransfersOutputPort {
    response: NextApiResponse<any>

    constructor(response: NextApiResponse) {
        super(response)
        this.response = response
    }

    streamResponseModelToViewModel(responseModel: ListTransfersResponse): TransferViewModel {
        const viewModel: TransferViewModel = {
            ...responseModel,
        }
        return viewModel
    }

    streamErrorModelToViewModel(error: ListTransfersError): TransferViewModel {
        const errorViewModel: TransferViewModel = getEmptyTransferViewModel();
        errorViewModel.status = 'error'
        errorViewModel.message = `${error.name}: ${error.message}`;
        return errorViewModel;
    }

    convertErrorModelToViewModel(errorModel: ListTransfersError): { status: number; viewModel: TransferViewModel; } {
        const viewModel: TransferViewModel = getEmptyTransferViewModel();
        // gateway errors
        const name = errorModel.name ? errorModel.name : '';
        const message = errorModel.message ? errorModel.message.toString() : name;
        viewModel.message = message;
        const errorCode = errorModel.code ? errorModel.code : 500;
        return {
            status: errorCode,
            viewModel: viewModel
        }
    }
}