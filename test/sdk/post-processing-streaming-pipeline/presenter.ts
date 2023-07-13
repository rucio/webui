import { BaseStreamingPresenter } from "@/lib/sdk/presenter"
import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models"
import { StreamData, TResponseModel } from "./models"

export class TestPresenter extends BaseStreamingPresenter<
        BaseResponseModel,
        StreamData,
        BaseErrorResponseModel
    > {
        constructor(response: any) {
            super(response)
        }
        convertErrorModelToViewModel(errorModel: BaseErrorResponseModel): {
            status: number
            viewModel: StreamData
        } {
            return {
                status: 200,
                viewModel: {
                    title: 'failed: ' + errorModel.message,
                },
            }
        }
        convertResponseModelToViewModel(
            responseModel: TResponseModel,
        ): StreamData {
            return {
                title: 'success: ' + responseModel.message,
            }
        }
    }