import { BasePresenter } from '@/lib/sdk/presenter';
import { GetRSEUsageError, GetRSEUsageResponse } from '@/lib/core/usecase-models/get-rse-usage-usecase-models';
import { getEmptyRSEUsageViewModel, RSEUsageViewModel } from '@/lib/infrastructure/data/view-model/rse-usage';

export default class GetRSEUsagePresenter extends BasePresenter<GetRSEUsageResponse, GetRSEUsageError, RSEUsageViewModel> {
    convertResponseModelToViewModel(responseModel: GetRSEUsageResponse): { viewModel: RSEUsageViewModel; status: number } {
        const viewModel: RSEUsageViewModel = {
            ...responseModel,
        };
        return {
            status: 200,
            viewModel: viewModel,
        };
    }

    convertErrorModelToViewModel(errorModel: GetRSEUsageError): { viewModel: RSEUsageViewModel; status: number } {
        const viewModel: RSEUsageViewModel = getEmptyRSEUsageViewModel();

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
