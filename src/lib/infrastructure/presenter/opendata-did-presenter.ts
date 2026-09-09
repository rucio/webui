import { OpenDataDIDError, OpenDataDIDResponse } from '@/lib/core/usecase-models/opendata-did-usecase-models';
import { BasePresenter } from '@/lib/sdk/presenter';

export type OpenDataDIDViewModel = {
    status: 'success' | 'error';
    message?: string;

    scope: string;
    name: string;
    state?: string;
    doi?: string | null;
    record_id?: number | null;
    files: OpenDataDIDResponse['files'];

    meta: Record<string, unknown>;
};

export default class OpenDataDIDPresenter extends BasePresenter<OpenDataDIDResponse, OpenDataDIDError, OpenDataDIDViewModel> {
    convertResponseModelToViewModel(responseModel: OpenDataDIDResponse): {
        viewModel: OpenDataDIDViewModel;
        status: number;
    } {
        const viewModel: OpenDataDIDViewModel = {
            status: 'success',
            scope: responseModel.scope,
            name: responseModel.name,
            state: responseModel.state,
            doi: responseModel.doi,
            record_id: responseModel.record_id,
            files: responseModel.files,
            meta: responseModel.meta,
        };

        return {
            status: 200,
            viewModel,
        };
    }

    convertErrorModelToViewModel(errorModel: OpenDataDIDError): {
        viewModel: OpenDataDIDViewModel;
        status: number;
    } {
        const status = errorModel.code ?? 500;
        const message = errorModel.message ? errorModel.message.toString() : errorModel.error;

        const viewModel: OpenDataDIDViewModel = {
            status: 'error',
            message,
            scope: '',
            name: '',
            state: undefined,
            doi: null,
            record_id: null,
            files: [],
            meta: {},
        };

        return {
            status,
            viewModel,
        };
    }
}
