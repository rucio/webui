import { BaseStreamingOutputPort } from "@/lib/common/base-components/primary-ports";
import { ListDIDsError, ListDIDsResponse } from "@/lib/core/data/usecase-models/list-dids-usecase-models";
import { NextApiResponse } from "next";
import { ListDIDsViewModel } from "@/lib/infrastructure/data/view-model/list-did";
import { BaseStreamingPresenter } from "@/lib/common/base-components/presenter";

export default class ListDIDsPresenter extends BaseStreamingPresenter<ListDIDsResponse, ListDIDsViewModel, ListDIDsError> implements BaseStreamingOutputPort<ListDIDsResponse, ListDIDsViewModel, ListDIDsError> {
    response: NextApiResponse<any>;

    constructor(response: NextApiResponse) {
        super(response);
        this.response = response;
    }

    convertResponseModelToViewModel(responseModel: ListDIDsResponse): ListDIDsViewModel {
        const viewModel: ListDIDsViewModel = {
            name: responseModel.name,
            scope: responseModel.scope,
            did_type: responseModel.did_type,
            bytes: responseModel.bytes,
            length: responseModel.length,
        }
        return viewModel;
    }

    async presentError(error: ListDIDsError): Promise<void> {
        this.response.status(400).json(JSON.stringify(error));
    }
}