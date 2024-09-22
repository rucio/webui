import { BasePresenter } from "@/lib/sdk/presenter";
import { AddDIDError, AddDIDResponse } from "@/lib/core/usecase-models/add-did-usecase-models";
import {AddDIDViewModel, getEmptyAddDIDViewModel} from "@/lib/infrastructure/data/view-model/did";

export default class AddDIDPresenter extends BasePresenter<AddDIDResponse, AddDIDError, AddDIDViewModel> {
    convertResponseModelToViewModel(responseModel: AddDIDResponse): { viewModel: AddDIDViewModel; status: number; } {
        const viewModel: AddDIDViewModel = {
            ...responseModel,
        }
        return {
            status: 200,
            viewModel: viewModel
        }
    }
    
    convertErrorModelToViewModel(errorModel: AddDIDError): { viewModel: AddDIDViewModel; status: number; } {
        const viewModel: AddDIDViewModel = getEmptyAddDIDViewModel();
        // gateway errors
        const message = errorModel.message || errorModel.name;
        viewModel.message = message;
        const errorCode = errorModel.code || 500;
        return {
            status: errorCode,
            viewModel: viewModel
        }
    }

}