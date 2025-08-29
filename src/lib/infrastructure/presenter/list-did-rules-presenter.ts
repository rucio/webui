import { ListDIDRulesOutputPort } from '@/lib/core/port/primary/list-did-rules-ports';
import { ListDIDRulesError, ListDIDRulesResponse } from '@/lib/core/usecase-models/list-did-rules-usecase-models';
import { BaseStreamingPresenter } from '@/lib/sdk/presenter';
import { DIDRulesViewModel, generateEmptyDIDRulesViewModel as getEmptyDIDRulesViewModel } from '../data/view-model/did';

export default class ListDIDRulesPresenter
    extends BaseStreamingPresenter<ListDIDRulesResponse, ListDIDRulesError, DIDRulesViewModel>
    implements ListDIDRulesOutputPort
{
    convertErrorModelToViewModel(errorModel: ListDIDRulesError): { status: number; viewModel: DIDRulesViewModel } {
        const viewModel: DIDRulesViewModel = getEmptyDIDRulesViewModel();

        // custom usecase errors
        if (errorModel.name === 'Invalid Account') {
            viewModel.message = errorModel.message;
            return {
                status: 400,
                viewModel: viewModel,
            };
        }
        // gateway errors
        const message = errorModel.message ? errorModel.message.toString() : errorModel.name;
        const name = errorModel.name ? errorModel.name : '';
        viewModel.message = message;
        const errorCode = errorModel.code ? errorModel.code : 500;
        return {
            status: errorCode,
            viewModel: viewModel,
        };
    }

    streamResponseModelToViewModel(responseModel: ListDIDRulesResponse): DIDRulesViewModel {
        let subscription = undefined;
        if (responseModel.subscription_name && responseModel.subscription_account) {
            subscription = {
                name: responseModel.subscription_name,
                account: responseModel.subscription_account,
            };
        }

        const millisecondsRemaining = responseModel.expires_at ? new Date(responseModel.expires_at).getTime() - Date.now() : 0;

        const viewModel: DIDRulesViewModel = {
            ...responseModel,
            subscription: subscription,
            remaining_lifetime: millisecondsRemaining / 1000, // Convert to seconds
        };
        return viewModel;
    }

    streamErrorModelToViewModel(error: ListDIDRulesError): DIDRulesViewModel {
        const errorViewModel: DIDRulesViewModel = getEmptyDIDRulesViewModel();
        errorViewModel.status = 'error';
        errorViewModel.message = `${error.name}: ${error.message}`;
        return errorViewModel;
    }
}
