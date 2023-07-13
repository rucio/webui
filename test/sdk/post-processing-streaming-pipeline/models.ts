import { AuthenticatedRequestModel, BaseResponseModel } from "@/lib/sdk/usecase-models"

export type RequestModel = AuthenticatedRequestModel<{}>
export interface TResponseModel extends BaseResponseModel {
        message: string
}

export type StreamData = {
    title: string
}