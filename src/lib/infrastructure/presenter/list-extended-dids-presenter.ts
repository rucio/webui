import { BaseStreamingPresenter } from '@/lib/sdk/presenter';
import { ListExtendedDIDsError, ListExtendedDIDsResponse } from '@/lib/core/usecase-models/list-extended-dids-usecase-models';
import { generateEmptyListExtendedDIDsViewModel, ListExtendedDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { ListDIDsError } from '@/lib/core/usecase-models/list-dids-usecase-models';
import { DIDType } from '@/lib/core/entity/rucio';

export default class ListExtendedDIDsPresenter extends BaseStreamingPresenter<
    ListExtendedDIDsResponse,
    ListExtendedDIDsError,
    ListExtendedDIDsViewModel
> {
    streamResponseModelToViewModel(responseModel: ListExtendedDIDsResponse): ListExtendedDIDsViewModel {
        const viewModel: ListExtendedDIDsViewModel = {
            ...responseModel,
        };
        return viewModel;
    }

    streamErrorModelToViewModel(error: ListDIDsError): ListExtendedDIDsViewModel {
        return {
            status: 'error',
            message: error.message,
            name: error.name,
            scope: '',
            account: '',
            adler32: null,
            bytes: 0,
            did_type: DIDType.UNKNOWN,
            expired_at: null,
            length: 0,
            md5: null,
            monotonic: null,
            open: null,
        };
    }

    convertErrorModelToViewModel(errorModel: ListExtendedDIDsError): { viewModel: ListExtendedDIDsViewModel; status: number } {
        const viewModel: ListExtendedDIDsViewModel = generateEmptyListExtendedDIDsViewModel();
        const message = errorModel.message || errorModel.name;
        viewModel.message = message;
        const errorCode = errorModel.code || 500;
        return {
            status: errorCode,
            viewModel: viewModel,
        };
    }
}
