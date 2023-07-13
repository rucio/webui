import { BaseDTO } from '@/lib/sdk/dto'
import { BasePostProcessingPipelineElement } from '@/lib/sdk/postprocessing-pipeline-elements'
import { BasePresenter } from '@/lib/sdk/presenter'
import { BasePostProcessingPipelineUseCase } from '@/lib/sdk/usecase'
import {
    BaseErrorResponseModel,
    BaseResponseModel,
} from '@/lib/sdk/usecase-models'
import { BaseViewModel } from '@/lib/sdk/view-models'
import { createHttpMocks } from 'test/fixtures/http-fixtures'

type RequestModel = {}
interface TResponseModel extends BaseResponseModel {
    message: string
}

class FirstPipelineElement extends BasePostProcessingPipelineElement<
    RequestModel,
    TResponseModel,
    BaseErrorResponseModel,
    BaseDTO
> {
    makeGatewayRequest(
        requestModel: RequestModel,
        responseModel: TResponseModel,
    ): Promise<BaseDTO> {
        return Promise.resolve({
            status: 'success',
            message: '_pipeline_element_1',
        })
    }
    validateDTO(dto: BaseDTO): {
        status: 'error' | 'success' | 'critical'
        data: BaseErrorResponseModel | BaseDTO
    } {
        return {
            status: 'success',
            data: dto,
        }
    }
    handleGatewayError(error: BaseDTO): BaseErrorResponseModel {
        throw new Error('Method not implemented.')
    }
    transformResponseModel(
        responseModel: TResponseModel,
        dto: BaseDTO,
    ): TResponseModel {
        responseModel.message = responseModel.message + dto.message + '_transformed'
        return responseModel
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
        throw new Error('Method not implemented.')
    }
}
class TestMultiCallUseCase extends BasePostProcessingPipelineUseCase<
    RequestModel,
    TResponseModel,
    BaseErrorResponseModel,
    BaseDTO> {

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

    makeGatewayRequest(requestModel: RequestModel): Promise<BaseDTO> {
        return Promise.resolve({
            status: 'success',
            message: 'root_element',
        })
    }

    handleGatewayError(error: BaseDTO): BaseErrorResponseModel {
        throw new Error('Method not implemented.')
    }
    processDTO(dto: BaseDTO): { data: TResponseModel | BaseErrorResponseModel; status: 'success' | 'error' } {
        const responseModel: TResponseModel = {
            status: 'success',
            message: dto.message? dto.message : '',
        }
        return {
            data: responseModel,
            status: 'success',
        }
    }
        
    }
describe('BaseMultiCallStreamableUseCase', () => {
    it('Should pass', async() => {
        const { req, res, session } = await createHttpMocks()
        const useCase = new TestMultiCallUseCase(new TestPresenter(res))
        await useCase.execute({})
        const response = res._getJSONData()
        expect(response).toEqual({
            status: 'success',
            message: 'root_element_pipeline_element_1_transformed',
        })
    })
})
