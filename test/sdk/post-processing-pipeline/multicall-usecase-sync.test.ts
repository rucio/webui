import { BaseDTO } from '@/lib/sdk/dto'
import { BasePostProcessingPipelineElement } from '@/lib/sdk/postprocessing-pipeline-elements'
import { BasePresenter } from '@/lib/sdk/presenter'
import { BasePostProcessingPipelineUseCase } from '@/lib/sdk/usecase'
import {
    BaseErrorResponseModel,
    BaseResponseModel,
} from '@/lib/sdk/usecase-models'
import { BaseViewModel } from '@/lib/sdk/view-models'
import { NextApiResponse } from 'next'
import { createHttpMocks } from 'test/fixtures/http-fixtures'

type RequestModel = {}
type DTO = BaseDTO & { message: string }
interface TResponseModel extends BaseResponseModel {
    message: string
}

class FirstPipelineElement extends BasePostProcessingPipelineElement<
    RequestModel,
    TResponseModel,
    BaseErrorResponseModel,
    DTO
> {
    makeGatewayRequest(
        requestModel: RequestModel,
        responseModel: TResponseModel,
    ): Promise<DTO> {
        return Promise.resolve({
            status: 'success',
            message: '_pipeline_element_1',
        })
    }
    validateDTO(dto: DTO): {
        status: 'error' | 'success' | 'critical'
        data: BaseErrorResponseModel | DTO
    } {
        return {
            status: 'success',
            data: dto,
        }
    }
    handleGatewayError(error: DTO): BaseErrorResponseModel {
        throw new Error('Method not implemented.')
    }
    transformResponseModel(
        responseModel: TResponseModel,
        dto: DTO,
    ): TResponseModel {
        responseModel.message = responseModel.message + dto.message + '_transformed'
        return responseModel
    }
}

class ErrorPipelineElement extends BasePostProcessingPipelineElement<
    RequestModel,
    TResponseModel,
    BaseErrorResponseModel,
    DTO
> {
    makeGatewayRequest(requestModel: RequestModel, responseModel: TResponseModel): Promise<DTO> {
        return Promise.resolve({
            status: 'error',
            errorCode: 401,
            errorType: 'gateway_endpoint_error',
            errorMessage: 'Failed to authenticate user',
        } as DTO)
    }
    handleGatewayError(error: DTO): BaseErrorResponseModel {
        throw new Error('Method not implemented.')
    }
    transformResponseModel(responseModel: TResponseModel, dto: DTO): TResponseModel | BaseErrorResponseModel {
        throw new Error('Method not implemented.')
    }

}

class TestPresenter extends BasePresenter<TResponseModel, BaseErrorResponseModel, BaseViewModel> {
    convertResponseModelToViewModel(responseModel: TResponseModel): { viewModel: BaseViewModel; status: number } {
        return {
            viewModel: {
                status: "success",
                message: responseModel.message,
            },
            status: 200,
        }
    }
    convertErrorModelToViewModel(errorModel: BaseErrorResponseModel): { viewModel: BaseViewModel; status: number } {
        return {
            viewModel: {
                status: "error",
                message: errorModel.message,
            },
            status: errorModel.code,
        }
    }
}
class TestMultiCallUseCase extends BasePostProcessingPipelineUseCase<
    RequestModel,
    TResponseModel,
    BaseErrorResponseModel,
    BaseDTO & { message: string }> {

    constructor(presenter: BasePresenter<TResponseModel, BaseErrorResponseModel, BaseViewModel>) {
        const firstPipelineElement = new FirstPipelineElement()
        super(presenter, [firstPipelineElement])
    }

    validateFinalResponseModel(responseModel: TResponseModel): { isValid: boolean; errorModel?: BaseErrorResponseModel | undefined } {
        return {
            isValid: true,
        }
    }
    validateRequestModel(requestModel: RequestModel): BaseErrorResponseModel | undefined {
        return undefined
    }

    makeGatewayRequest(requestModel: RequestModel): Promise<DTO> {
        return Promise.resolve({
            status: 'success',
            message: 'root_element',
        })
    }

    handleGatewayError(error: BaseDTO): BaseErrorResponseModel {
        throw new Error('Method not implemented.')
    }
    processDTO(dto: DTO): { data: TResponseModel | BaseErrorResponseModel; status: 'success' | 'error' } {
        const responseModel: TResponseModel = {
            status: 'success',
            message: dto.message,
        }
        return {
            data: responseModel,
            status: 'success',
        }
    }

}

class TestErrorPipelineUseCase extends BasePostProcessingPipelineUseCase<
RequestModel,
TResponseModel,
BaseErrorResponseModel,
BaseDTO & { message: string }> {

constructor(presenter: BasePresenter<TResponseModel, BaseErrorResponseModel, BaseViewModel>) {
    const firstPipelineElement = new FirstPipelineElement()
    const errorPipelineElement = new ErrorPipelineElement()
    super(presenter, [firstPipelineElement, errorPipelineElement])
}

validateFinalResponseModel(responseModel: TResponseModel): { isValid: boolean; errorModel?: BaseErrorResponseModel | undefined } {
    return {
        isValid: true,
    }
}
validateRequestModel(requestModel: RequestModel): BaseErrorResponseModel | undefined {
    return undefined
}

makeGatewayRequest(requestModel: RequestModel): Promise<DTO> {
    return Promise.resolve({
        status: 'success',
        message: 'root_element',
    })
}

handleGatewayError(error: BaseDTO): BaseErrorResponseModel {
    throw new Error('Method not implemented.')
}
processDTO(dto: DTO): { data: TResponseModel | BaseErrorResponseModel; status: 'success' | 'error' } {
    const responseModel: TResponseModel = {
        status: 'success',
        message: dto.message,
    }
    return {
        data: responseModel,
        status: 'success',
    }
}

}
describe('BaseMultiCallStreamableUseCase', () => {
    
    it('Should pass', async () => {
        const { req, res, session } = await createHttpMocks()
        const useCase = new TestMultiCallUseCase(new TestPresenter(res as unknown as NextApiResponse))
        await useCase.execute({})
        const response = res._getJSONData()
        expect(response).toEqual({
            status: 'success',
            message: 'root_element_pipeline_element_1_transformed',
        })
    })

    it('Should fail', async () => {
        const { req, res, session } = await createHttpMocks()
        const useCase = new TestErrorPipelineUseCase(new TestPresenter(res as unknown as NextApiResponse))
        await useCase.execute({})
        const statusCode = res._getStatusCode()
        expect(statusCode).toEqual(401)
        const response = res._getJSONData()
        expect(response).toEqual({
            status: 'error',
            message: 'Failed to authenticate user',
        })
    })
})
