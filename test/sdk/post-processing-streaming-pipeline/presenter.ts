import { BaseStreamingPresenter } from "@/lib/sdk/presenter"
import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models"
import { StreamData, TResponseModel, ViewModel } from "./models"

export class TestPresenter extends BaseStreamingPresenter<
        BaseResponseModel,
        BaseErrorResponseModel,
        ViewModel
    > {
        constructor(response: any) {
            super(response)
        }
        convertErrorModelToViewModel(errorModel: BaseErrorResponseModel): {
            status: number
            viewModel: ViewModel
        } {
            return {
                status: 200,
                viewModel: {
                    status: 'error',
                    title: 'failed: ' + errorModel.message,
                },
            }
        }
        convertResponseModelToViewModel(
            responseModel: TResponseModel,
        ): ViewModel {
            return {
                status: 'success',
                title: 'success: ' + responseModel.message,
            }
        }
    }