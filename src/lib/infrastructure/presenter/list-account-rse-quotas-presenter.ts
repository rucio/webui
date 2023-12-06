import { BaseStreamingPresenter } from "@/lib/sdk/presenter";
import { ListAccountRSEQuotasResponse, ListAccountRSEQuotasError } from "@/lib/core/usecase-models/list-account-rse-quotas-usecase-models";
import { getEmptyRSEAccountUsageLimitViewModel, RSEAccountUsageLimitViewModel } from "../data/view-model/rse";
import { NextApiResponse } from "next";

export default class ListAccountRSEQuotasPresenter extends BaseStreamingPresenter<ListAccountRSEQuotasResponse, ListAccountRSEQuotasError, RSEAccountUsageLimitViewModel> {
    response: NextApiResponse<any>;

    constructor(response: NextApiResponse) {
        super(response);
        this.response = response;
    }
    
    convertErrorModelToViewModel(errorModel: ListAccountRSEQuotasError): { status: number; viewModel: RSEAccountUsageLimitViewModel; } {
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

    streamResponseModelToViewModel(responseModel: ListAccountRSEQuotasResponse): RSEAccountUsageLimitViewModel {
        const viewModel: RSEAccountUsageLimitViewModel = {
            ...responseModel,
        };
        return viewModel;
    }

    streamErrorModelToViewModel(error: ListAccountRSEQuotasError): RSEAccountUsageLimitViewModel {
        const viewModel: RSEAccountUsageLimitViewModel = getEmptyRSEAccountUsageLimitViewModel();
        viewModel.message = error.message;
        viewModel.status = 'error';
        return viewModel;
    }
} 