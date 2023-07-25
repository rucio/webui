import { BaseStreamingPresenter } from "@/lib/sdk/presenter"
import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models"
import { TResponseModel, ViewModel } from "./models"

export class TestPresenter extends BaseStreamingPresenter<
        BaseResponseModel,
        BaseErrorResponseModel,
        ViewModel
    > {
        streamErrorModelToViewModel(error: BaseErrorResponseModel, streamElement: string): ViewModel {
            const viewModel: ViewModel = {
                status: 'error',
                title: 'failed: ' + error.message + ' for stream element: ' + streamElement,
            }
            return viewModel
        }
        
        constructor(response: any) {
            super(response)
        }
        convertErrorModelToViewModel(errorModel: BaseErrorResponseModel): {
            status: number
            viewModel: ViewModel
        } {
            return {
                status: errorModel.code || 500,
                viewModel: {
                    status: 'error',
                    title: 'failed: ' + errorModel.message,
                },
            }
        }
        streamResponseModelToViewModel(
            responseModel: TResponseModel,
        ): ViewModel {
            return {
                status: 'success',
                title: 'success: ' + responseModel.message,
            }
        }
    }