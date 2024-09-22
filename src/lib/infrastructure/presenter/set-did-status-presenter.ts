import { BasePresenter } from '@/lib/sdk/presenter';
import { SetDIDStatusError, SetDIDStatusResponse } from '@/lib/core/usecase-models/set-did-status-usecase-models';
import { getEmptySetDIDStatusViewModel, SetDIDStatusViewModel } from '@/lib/infrastructure/data/view-model/did';

export default class SetDIDStatusPresenter extends BasePresenter<SetDIDStatusResponse, SetDIDStatusError, SetDIDStatusViewModel> {
    convertResponseModelToViewModel(responseModel: SetDIDStatusResponse): { viewModel: SetDIDStatusViewModel; status: number } {
        const viewModel: SetDIDStatusViewModel = {
            ...responseModel,
        };
        return {
            status: 200,
            viewModel: viewModel,
        };
    }

    convertErrorModelToViewModel(errorModel: SetDIDStatusError): { viewModel: SetDIDStatusViewModel; status: number } {
        const viewModel: SetDIDStatusViewModel = getEmptySetDIDStatusViewModel();

        // gateway errors
        const message = errorModel.message || errorModel.name;
        viewModel.message = message;
        const errorCode = errorModel.code || 500;
        return {
            status: errorCode,
            viewModel: viewModel,
        };
    }
}
