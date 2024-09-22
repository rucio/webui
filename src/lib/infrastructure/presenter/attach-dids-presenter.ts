import { BasePresenter } from "@/lib/sdk/presenter";
import { AttachDIDsError, AttachDIDsResponse } from "@/lib/core/usecase-models/attach-dids-usecase-models";
import {AttachDIDsViewModel, getEmptyAttachDIDsViewModel} from "@/lib/infrastructure/data/view-model/did";

export default class AttachDIDsPresenter extends BasePresenter<AttachDIDsResponse, AttachDIDsError, AttachDIDsViewModel> {
    convertResponseModelToViewModel(responseModel: AttachDIDsResponse): { viewModel: AttachDIDsViewModel; status: number; } {
        const viewModel: AttachDIDsViewModel = {
            ...responseModel,
        }
        return {
            status: 200,
            viewModel: viewModel
        }
    }
    
    convertErrorModelToViewModel(errorModel: AttachDIDsError): { viewModel: AttachDIDsViewModel; status: number; } {
        const viewModel: AttachDIDsViewModel = getEmptyAttachDIDsViewModel();

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