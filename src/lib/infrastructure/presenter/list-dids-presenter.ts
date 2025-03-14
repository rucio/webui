import { ListDIDsError, ListDIDsResponse } from '@/lib/core/usecase-models/list-dids-usecase-models';
import { NextApiResponse } from 'next';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { BaseStreamingPresenter } from '@/lib/sdk/presenter';
import { DIDType } from '@/lib/core/entity/rucio';
import { ListDIDsOutputPort } from '@/lib/core/port/primary/list-dids-ports';

export default class ListDIDsPresenter
    extends BaseStreamingPresenter<ListDIDsResponse, ListDIDsError, ListDIDsViewModel>
    implements ListDIDsOutputPort
{
    response: NextApiResponse<any>;

    constructor(response: NextApiResponse) {
        super(response);
        this.response = response;
    }

    streamResponseModelToViewModel(responseModel: ListDIDsResponse): ListDIDsViewModel {
        const viewModel: ListDIDsViewModel = {
            status: 'success',
            name: responseModel.name,
            scope: responseModel.scope,
            did_type: responseModel.did_type,
            bytes: responseModel.bytes,
            length: responseModel.length,
        };
        return viewModel;
    }

    streamErrorModelToViewModel(error: ListDIDsError): ListDIDsViewModel {
        return {
            status: 'error',
            message: error.message,
            name: error.name,
            bytes: 0,
            length: 0,
            scope: '',
            did_type: DIDType.UNKNOWN,
        };
    }

    /**
     * Converts an error model to an error view model.
     * @param errorModel The error model to convert.
     * @returns The error view model that represents the error model.
     */
    convertErrorModelToViewModel(errorModel: ListDIDsError): {
        status: number;
        viewModel: ListDIDsViewModel;
    } {
        const status = errorModel.error === 'Invalid DID Query' || errorModel.error === 'Invalid Request' ? 400 : 500;
        const message = errorModel.message ? errorModel.message.toString() : errorModel.error;
        const viewModel: ListDIDsViewModel = {
            status: 'error',
            message,
            name: '',
            scope: '',
            did_type: DIDType.UNKNOWN,
            bytes: 0,
            length: 0,
        };
        return { status, viewModel };
    }
}
