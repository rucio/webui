import { BasePresenter } from '@/lib/sdk/presenter';
import { GetDDMLinkError, GetDDMLinkResponse } from '@/lib/core/usecase-models/get-ddm-link-usecase-models';
import { DDMLinkViewModel } from '../data/view-model/request';

export default class GetDDMLinkPresenter extends BasePresenter<GetDDMLinkResponse, GetDDMLinkError, DDMLinkViewModel> {
    convertResponseModelToViewModel(responseModel: GetDDMLinkResponse): { viewModel: DDMLinkViewModel; status: number } {
        const viewModel: DDMLinkViewModel = {
            ...responseModel,
        };
        return {
            status: 200,
            viewModel: viewModel,
        };
    }

    convertErrorModelToViewModel(errorModel: GetDDMLinkError): { viewModel: DDMLinkViewModel; status: number } {
        const viewModel: DDMLinkViewModel = {
            status: 'error',
            url: '',
        };
        const message = errorModel.message.toString() || errorModel.name;
        viewModel.message = message;

        if (errorModel.type === 'FeatureDisabledError') {
            viewModel.errorType = 'feature_disabled';
        } else if (errorModel.type === 'ConfigNotFoundError') {
            viewModel.errorType = 'config_not_found';
        } else {
            viewModel.errorType = 'unknown';
        }

        const errorCode = errorModel.code || 500;
        return {
            status: errorCode,
            viewModel: viewModel,
        };
    }
}
