import { BasePresenter } from "@/lib/sdk/presenter";
import { GetRSEProtocolsError, GetRSEProtocolsResponse } from "@/lib/core/usecase-models/get-rse-protocols-usecase-models";
import { generateEmptyRSEProtocolViewModel, RSEProtocolViewModel } from "@/lib/infrastructure/data/view-model/rse";

export default class GetRSEProtocolsPresenter extends BasePresenter<GetRSEProtocolsResponse, GetRSEProtocolsError, RSEProtocolViewModel> {
    convertResponseModelToViewModel(responseModel: GetRSEProtocolsResponse): { viewModel: RSEProtocolViewModel; status: number; } {
        const viewModel: RSEProtocolViewModel = {
            ...responseModel,
        }
        return {
            status: 200,
            viewModel: viewModel
        }
    }
    
    convertErrorModelToViewModel(errorModel: GetRSEProtocolsError): { viewModel: RSEProtocolViewModel; status: number; } {
        const viewModel: RSEProtocolViewModel = generateEmptyRSEProtocolViewModel();
        // gateway errors
        const message = errorModel.message || errorModel.name;
        viewModel.message = message;
        const errorCode = errorModel.code || 500;
        return {
            status: errorCode,
            viewModel: viewModel
        }
    }

}