import { BaseStreamingPresenter } from "@/lib/sdk/presenter";
import { ListAccountRSEUsageResponse, ListAccountRSEUsageError } from "@/lib/core/usecase-models/list-account-rse-usage-usecase-models";
import { getEmptyRSEAccountUsageLimitViewModel, RSEAccountUsageLimitViewModel } from "../data/view-model/rse";
import { NextApiResponse } from "next";

export default class ListAccountRSEUsagePresenter extends BaseStreamingPresenter<ListAccountRSEUsageResponse, ListAccountRSEUsageError, RSEAccountUsageLimitViewModel> {
    response: NextApiResponse<any>;

    constructor(response: NextApiResponse) {
        super(response);
        this.response = response;
    }
    
    convertErrorModelToViewModel(errorModel: ListAccountRSEUsageError): { status: number; viewModel: RSEAccountUsageLimitViewModel; } {
        const viewModel: RSEAccountUsageLimitViewModel = getEmptyRSEAccountUsageLimitViewModel();
        const error = errorModel.error;
        if(error === 'INVALID_ACCOUNT') {
            viewModel.message = errorModel.message;
            return {
                status: 400,
                viewModel: viewModel
            }
        }
        const message = errorModel.message ? errorModel.message.toString() : errorModel.error;
        viewModel.message = message;
        const errorCode = errorModel.code ? errorModel.code : 500;
        return {
            status: errorCode,
            viewModel: viewModel
        }
    }

    streamResponseModelToViewModel(responseModel: ListAccountRSEUsageResponse): RSEAccountUsageLimitViewModel {
        const viewModel: RSEAccountUsageLimitViewModel = {
            ...responseModel,
        };
        return viewModel;
    }

    streamErrorModelToViewModel(error: ListAccountRSEUsageError): RSEAccountUsageLimitViewModel {
        const viewModel: RSEAccountUsageLimitViewModel = getEmptyRSEAccountUsageLimitViewModel();
        viewModel.message = error.message;
        viewModel.status = 'error';
        return viewModel;
    }
} 