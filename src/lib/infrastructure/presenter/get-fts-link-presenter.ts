import { BasePresenter } from '@/lib/sdk/presenter';
import { GetFTSLinkError, GetFTSLinkResponse } from '@/lib/core/usecase-models/get-fts-link-usecase-models';
import { FTSLinkViewModel } from '../data/view-model/request';

export default class GetFTSLinkPresenter extends BasePresenter<GetFTSLinkResponse, GetFTSLinkError, FTSLinkViewModel> {
    convertResponseModelToViewModel(responseModel: GetFTSLinkResponse): { viewModel: FTSLinkViewModel; status: number } {
        const viewModel: FTSLinkViewModel = {
            ...responseModel,
        };
        return {
            status: 200,
            viewModel: viewModel,
        };
    }

    convertErrorModelToViewModel(errorModel: GetFTSLinkError): { viewModel: FTSLinkViewModel; status: number } {
        const viewModel: FTSLinkViewModel = {
            status: 'error',
            url: '',
        };
        const message = errorModel.message.toString() || errorModel.name;
        viewModel.message = message;
        const errorCode = errorModel.code || 500;
        return {
            status: errorCode,
            viewModel: viewModel,
        };
    }
}
