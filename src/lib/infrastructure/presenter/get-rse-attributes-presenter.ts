import { BasePresenter } from '@/lib/sdk/presenter';
import { GetRSEAttributesError, GetRSEAttributesResponse } from '@/lib/core/usecase-models/get-rse-attributes-usecase-models';
import { RSEAttributeViewModel } from '@/lib/infrastructure/data/view-model/rse';

export default class GetRSEAttributesPresenter extends BasePresenter<GetRSEAttributesResponse, GetRSEAttributesError, RSEAttributeViewModel> {
    convertResponseModelToViewModel(responseModel: GetRSEAttributesResponse): { viewModel: RSEAttributeViewModel; status: number } {
        const viewModel: RSEAttributeViewModel = {
            ...responseModel,
        };
        return {
            status: 200,
            viewModel: viewModel,
        };
    }

    convertErrorModelToViewModel(errorModel: GetRSEAttributesError): { viewModel: RSEAttributeViewModel; status: number } {
        const viewModel: RSEAttributeViewModel = {
            status: 'error',
            attributes: [],
        };

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
