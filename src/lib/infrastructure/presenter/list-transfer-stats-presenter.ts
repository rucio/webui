import { ListTransferStatsOutputPort } from "@/lib/core/port/primary/list-transfer-stats-ports";
import { ListTransferStatsError, ListTransferStatsResponse } from "@/lib/core/usecase-models/list-transfer-stats-usecase-models";
import { BaseStreamingPresenter } from "@/lib/sdk/presenter";
import { NextApiResponse } from "next";
import { generateEmptyTransferStatsViewModel, TransferStatsViewModel } from "../data/view-model/request-stats";

export default class ListTransferStatsPresenter extends BaseStreamingPresenter<ListTransferStatsResponse, ListTransferStatsError, TransferStatsViewModel> implements ListTransferStatsOutputPort {
    response: NextApiResponse<any>

    constructor(response: NextApiResponse) {
        super(response)
        this.response = response
    }

    streamResponseModelToViewModel(responseModel: ListTransferStatsResponse): TransferStatsViewModel {
        const viewModel: TransferStatsViewModel = {
            ...responseModel,
        }
        return viewModel
    }

    streamErrorModelToViewModel(error: ListTransferStatsError): TransferStatsViewModel {
        const errorViewModel: TransferStatsViewModel = generateEmptyTransferStatsViewModel();
        errorViewModel.message = `${error.name}: ${error.message}`;
        return errorViewModel;
    }

    /**
     * Converts an error model to an error view model.
     * @param errorModel The error model to convert.
     * @returns The error view model that represents the error model.
     */
    convertErrorModelToViewModel(errorModel: ListTransferStatsError): { status: number; viewModel: TransferStatsViewModel; } {
        const viewModel: TransferStatsViewModel = generateEmptyTransferStatsViewModel();
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