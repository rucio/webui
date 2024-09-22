import { BasePresenter } from '@/lib/sdk/presenter';
import { GetRSEError, GetRSEResponse } from '@/lib/core/usecase-models/get-rse-usecase-models';
import { generateEmptyRSEViewModel, RSEViewModel } from '@/lib/infrastructure/data/view-model/rse';

export default class GetRSEPresenter extends BasePresenter<GetRSEResponse, GetRSEError, RSEViewModel> {
    convertResponseModelToViewModel(responseModel: GetRSEResponse): { viewModel: RSEViewModel; status: number } {
        const viewModel: RSEViewModel = {
            ...responseModel,
        };
        return {
            status: 200,
            viewModel: viewModel,
        };
    }

    convertErrorModelToViewModel(errorModel: GetRSEError): { viewModel: RSEViewModel; status: number } {
        const viewModel: RSEViewModel = generateEmptyRSEViewModel();
        const message = errorModel.message.toString() || errorModel.name;
        viewModel.message = message;
        const errorCode = errorModel.code || 500;
        return {
            status: errorCode,
            viewModel: viewModel,
        };
    }
}
