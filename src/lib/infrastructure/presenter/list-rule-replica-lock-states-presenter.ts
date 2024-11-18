import {
    ListRuleReplicaLockStatesError,
    ListRuleReplicaLockStatesResponse,
} from '@/lib/core/usecase-models/list-rule-replica-lock-states-usecase-models';
import { NextApiResponse } from 'next';
import { ListRuleReplicaLockStatesViewModel, getEmptyListRuleReplicaLockStatesViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { BaseStreamingPresenter } from '@/lib/sdk/presenter';
import { ListRuleReplicaLockStatesOutputPort } from '@/lib/core/port/primary/list-rule-replica-lock-states-ports';

export default class ListRuleReplicaLockStatesPresenter
    extends BaseStreamingPresenter<ListRuleReplicaLockStatesResponse, ListRuleReplicaLockStatesError, ListRuleReplicaLockStatesViewModel>
    implements ListRuleReplicaLockStatesOutputPort
{
    response: NextApiResponse<any>;

    constructor(response: NextApiResponse) {
        super(response);
        this.response = response;
    }

    streamResponseModelToViewModel(responseModel: ListRuleReplicaLockStatesResponse): ListRuleReplicaLockStatesViewModel {
        const viewModel: ListRuleReplicaLockStatesViewModel = {
            ...responseModel,
        };
        return viewModel;
    }

    streamErrorModelToViewModel(error: ListRuleReplicaLockStatesError): ListRuleReplicaLockStatesViewModel {
        const errorViewModel: ListRuleReplicaLockStatesViewModel = getEmptyListRuleReplicaLockStatesViewModel();
        errorViewModel.status = 'error';
        errorViewModel.message = `${error.name}: ${error.message}`;
        return errorViewModel;
    }

    /**
     * Converts an error model to an error view model.
     * @param errorModel The error model to convert.
     * @returns The error view model that represents the error model.
     */
    convertErrorModelToViewModel(errorModel: ListRuleReplicaLockStatesError): { viewModel: ListRuleReplicaLockStatesViewModel; status: number } {
        const viewModel: ListRuleReplicaLockStatesViewModel = getEmptyListRuleReplicaLockStatesViewModel();
        const message = errorModel.message ? errorModel.message.toString() : errorModel.name;
        const name = errorModel.name ? errorModel.name : '';
        viewModel.message = message;
        const errorCode = errorModel.code ? errorModel.code : 500;
        return {
            status: errorCode,
            viewModel: viewModel,
        };
    }
}
