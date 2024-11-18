import { BasePresenter } from '@/lib/sdk/presenter';
import { GetRSEError, GetRSEResponse } from '@/lib/core/usecase-models/get-rse-usecase-models';
import { generateEmptyRSEDetailsViewModel, RSEDetailsViewModel } from '@/lib/infrastructure/data/view-model/rse';

export default class GetRSEPresenter extends BasePresenter<GetRSEResponse, GetRSEError, RSEDetailsViewModel> {
    convertResponseModelToViewModel(responseModel: GetRSEResponse): { viewModel: RSEDetailsViewModel; status: number } {
        const viewModel: RSEDetailsViewModel = {
            ...responseModel,
        };
        return {
            status: 200,
            viewModel: viewModel,
        };
    }

    convertErrorModelToViewModel(errorModel: GetRSEError): { viewModel: RSEDetailsViewModel; status: number } {
        const viewModel: RSEDetailsViewModel = generateEmptyRSEDetailsViewModel();
        const message = errorModel.message.toString() || errorModel.name;
        viewModel.message = message;
        const errorCode = errorModel.code || 500;
        return {
            status: errorCode,
            viewModel: viewModel,
        };
    }
}
