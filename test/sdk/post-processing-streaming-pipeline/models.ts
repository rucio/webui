import { BaseDTO } from "@/lib/sdk/dto"
import { AuthenticatedRequestModel, BaseResponseModel } from "@/lib/sdk/usecase-models"
import { BaseViewModel } from "@/lib/sdk/view-models"

export type RequestModel = AuthenticatedRequestModel<{}>
export interface TResponseModel extends BaseResponseModel {
        message: string
}

export type StreamData = string

export interface StreamDTO extends BaseDTO {
    status: 'success' | 'error'
    title: string
}

export interface ViewModel extends  BaseViewModel {
    title: string
}