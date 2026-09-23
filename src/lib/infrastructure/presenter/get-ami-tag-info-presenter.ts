import { BasePresenter } from '@/lib/sdk/presenter';
import { GetAMITagInfoError, GetAMITagInfoResponse } from '@/lib/core/usecase-models/get-ami-tag-info-usecase-models';
import { AMITagInfoViewModel } from '../data/view-model/ami';

export default class GetAMITagInfoPresenter extends BasePresenter<GetAMITagInfoResponse, GetAMITagInfoError, AMITagInfoViewModel> {
    convertResponseModelToViewModel(responseModel: GetAMITagInfoResponse): { viewModel: AMITagInfoViewModel; status: number } {
        return {
            status: 200,
            viewModel: { status: 'success', tags: responseModel.tags },
        };
    }

    convertErrorModelToViewModel(errorModel: GetAMITagInfoError): { viewModel: AMITagInfoViewModel; status: number } {
        const viewModel: AMITagInfoViewModel = {
            status: 'error',
            tags: [],
            message: errorModel.message || errorModel.name,
            errorType: errorModel.type === 'InvalidTagsError' ? 'invalid_tags' : 'unknown',
        };
        return {
            status: errorModel.code || 500,
            viewModel,
        };
    }
}
