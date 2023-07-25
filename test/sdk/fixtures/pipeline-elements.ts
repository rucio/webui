import { BaseDTO } from "@/lib/sdk/dto"
import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models"
import { BaseStreamingPostProcessingPipelineElement } from "@/lib/sdk/postprocessing-pipeline-elements"
import { TRequestModel, TResponseModel } from "./models"

export class FirstPipelineElement extends BaseStreamingPostProcessingPipelineElement<
    TRequestModel,
    TResponseModel,
    BaseErrorResponseModel,
    BaseDTO
> {
    makeGatewayRequest(
        requestModel: TRequestModel,
        responseModel: TResponseModel,
    ): Promise<BaseDTO> {
        const dto: BaseDTO = {
            status: 'success',
            errorMessage: 'pipeline element 1',
        }
        return Promise.resolve(dto)
    }
    validateDTO(dto: BaseDTO): {
        data: BaseDTO | BaseErrorResponseModel
        status: 'success' | 'error'
    } {
        return {
            status: 'success',
            data: dto
        }
    }

    handleGatewayError(error: BaseDTO): BaseErrorResponseModel {
        throw new Error('Method not implemented.')
    }

    transformResponseModel(
        responseModel: TResponseModel,
        dto: BaseDTO,
    ): TResponseModel {
        const message = responseModel.message + ' ' + dto.errorMessage + ' transformed '
        const transformedResponse: TResponseModel = {
            status: 'success',
            message: message,
        }
        return transformedResponse
    }
}

export class SecondPipelineElement extends BaseStreamingPostProcessingPipelineElement<
    TRequestModel,
    TResponseModel,
    BaseErrorResponseModel,
    BaseDTO
> {
    makeGatewayRequest(
        requestModel: TRequestModel,
        responseModel: TResponseModel,
    ): Promise<BaseDTO> {
        const dto: BaseDTO = {
            status: 'success',
            errorMessage: 'pipeline element 2',
        }
        return Promise.resolve(dto)
    }
    validateDTO(dto: BaseDTO): {
        data:  BaseDTO | BaseErrorResponseModel
        status: 'success' | 'error'
    } {
        return {
            status: 'success',
            data: dto
        }
    }

    handleGatewayError(error: BaseDTO): BaseErrorResponseModel {
        throw new Error('Method not implemented.')
    }

    transformResponseModel(
        responseModel: TResponseModel,
        dto: BaseDTO,
    ): TResponseModel {
        const message = responseModel.message + dto.errorMessage + ' transformed'
        const transformedResponse: TResponseModel = {
            status: 'success',
            message: message,
        }
        return transformedResponse
    }
}
