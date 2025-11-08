import { DIDAvailability, DIDType } from '@/lib/core/entity/rucio';
import { DIDMetaError, DIDMetaResponse } from '@/lib/core/usecase-models/did-meta-usecase-models';
import { BasePresenter } from '@/lib/sdk/presenter';
import { DIDMetaViewModel } from '../data/view-model/did';

export default class DIDMetaPresenter extends BasePresenter<DIDMetaResponse, DIDMetaError, DIDMetaViewModel> {
    convertResponseModelToViewModel(responseModel: DIDMetaResponse): { viewModel: DIDMetaViewModel; status: number } {
        const viewModel: DIDMetaViewModel = {
            status: 'success',
            name: responseModel.name,
            scope: responseModel.scope,
            account: responseModel.account,
            did_type: responseModel.did_type,
            created_at: responseModel.created_at,
            updated_at: responseModel.updated_at,
            availability: responseModel.availability,
            obsolete: responseModel.obsolete,
            hidden: responseModel.hidden,
            suppressed: responseModel.suppressed,
            purge_replicas: responseModel.purge_replicas,
            monotonic: responseModel.monotonic,
            // only for collections
            is_open: responseModel.is_open,
            // only for files
            adler32: responseModel.adler32,
            md5: responseModel.md5,
            guid: responseModel.guid,
            bytes: responseModel.bytes,
            is_opendata: responseModel.is_opendata,
        };
        return {
            status: 200,
            viewModel: viewModel,
        };
    }
    convertErrorModelToViewModel(errorModel: DIDMetaError): { viewModel: DIDMetaViewModel; status: number } {
        const status = errorModel.code; // TODO: check error type
        const message = errorModel.message ? errorModel.message.toString() : errorModel.error;
        const viewModel: DIDMetaViewModel = {
            status: 'error',
            message,
            name: '',
            scope: '',
            account: '',
            did_type: DIDType.UNKNOWN,
            created_at: '',
            updated_at: '',
            availability: DIDAvailability.UNKNOWN,
            obsolete: false,
            hidden: false,
            suppressed: false,
            purge_replicas: false,
            monotonic: false,
            // only for collections
            is_open: false,
            // only for files
            adler32: '',
            md5: '',
            guid: '',
            bytes: 0,
            is_opendata: false,
        };
        return { status, viewModel };
    }
}
