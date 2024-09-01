import { DIDKeyValuePairsDataError, DIDKeyValuePairsDataResponse } from '@/lib/core/usecase-models/did-keyvaluepairs-usecase-models';
import { DIDKeyValuePairsDataViewModel } from '../data/view-model/did';
import { BasePresenter } from '@/lib/sdk/presenter';

export default class DIDKeyValuePairsDataPresenter extends BasePresenter<
    DIDKeyValuePairsDataResponse,
    DIDKeyValuePairsDataError,
    DIDKeyValuePairsDataViewModel
> {
    convertResponseModelToViewModel(responseModel: DIDKeyValuePairsDataResponse): { viewModel: DIDKeyValuePairsDataViewModel; status: number } {
        const viewModel: DIDKeyValuePairsDataViewModel = {
            status: 'success',
            message: '',
            data: responseModel.data,
        };
        return {
            status: 200,
            viewModel: viewModel,
        };
    }
    convertErrorModelToViewModel(errorModel: DIDKeyValuePairsDataError): { viewModel: DIDKeyValuePairsDataViewModel; status: number } {
        const viewModel: DIDKeyValuePairsDataViewModel = {
            status: 'error',
            message: errorModel.message,
            data: [],
        };
        return {
            viewModel: viewModel,
            status: errorModel.code,
        };
    }
}
