import { BaseDTO, BaseStreamableDTO } from "@/lib/sdk/dto";
import { BaseStreamingPresenter } from "@/lib/sdk/presenter";
import { BaseMultiCallStreamableUseCase } from "@/lib/sdk/usecase";
import { AuthenticatedRequestModel, BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models";
import { BaseMultiCallUseCasePipelineElement } from "@/lib/sdk/usecase-stream-element";
import { BaseViewModel } from "@/lib/sdk/view-models";
import { createResponse } from "node-mocks-http";
import { createHttpMocks } from "test/fixtures/http-fixtures";
import { Readable } from "stream";

type RequestModel = AuthenticatedRequestModel<{}>
type StreamData = {
    title: string
}
class FirstPipelineElement extends BaseMultiCallUseCasePipelineElement<
    RequestModel,
    BaseResponseModel,
    BaseErrorResponseModel,
    BaseStreamableDTO
>{
    makeGatewayRequest(requestModel: RequestModel): Promise<BaseStreamableDTO> {
        const dto: BaseStreamableDTO = {
            status: 'success',
            stream: Readable.from(['dataset1', 'dataset2'])
        }
        return Promise.resolve(dto)
    }
    processDTO(dto: BaseDTO): { data: BaseResponseModel | BaseErrorResponseModel; status: "success" | "error"; } {
        return {
            status: 'success',
            data: {status: 'success', data: dto.message } as BaseResponseModel,
        }
    }
    handleGatewayError(error: BaseDTO): BaseErrorResponseModel {
        throw new Error("Method not implemented.");
    }
    transformResponseModel(responseModel: BaseResponseModel, dto: BaseDTO): BaseResponseModel {
        return responseModel
    }

}

class SecondPipelineElement extends BaseMultiCallUseCasePipelineElement<
    RequestModel,
    BaseResponseModel,
    BaseErrorResponseModel,
    BaseDTO
    >{

        makeGatewayRequest(requestModel: RequestModel): Promise<BaseDTO> {
            throw new Error("Method not implemented.");
        }
        processDTO(dto: BaseDTO): { data: BaseResponseModel | BaseErrorResponseModel; status: "success" | "error"; } {
            throw new Error("Method not implemented.");
        }
        handleGatewayError(error: BaseDTO): BaseErrorResponseModel {
            throw new Error("Method not implemented.");
        }
        transformResponseModel(responseModel: BaseResponseModel, dto: BaseDTO): BaseResponseModel {
            throw new Error("Method not implemented.");
        }
}

class TestPresenter extends BaseStreamingPresenter<BaseResponseModel, StreamData, BaseErrorResponseModel>{
    constructor(response: any){
        super(response)
    }
    convertErrorModelToViewModel(errorModel: BaseErrorResponseModel): { status: number; viewModel: StreamData; } {
        return {
            status: 200,
            viewModel: {
                title: 'failed: ' + errorModel.message
            }
        }
    }
    convertResponseModelToViewModel(responseModel: BaseResponseModel): StreamData {
        return {
            title: 'success: ' + responseModel.status
        }
    }
}

class TestMultiCallPipelineUseCase extends BaseMultiCallStreamableUseCase<
RequestModel, BaseResponseModel, BaseErrorResponseModel, StreamData>{
    public response = createResponse()
    constructor(response: any){
        const firstPipelineElement = new FirstPipelineElement()
        const secondPipelineElement = new SecondPipelineElement()
        const presenter = new TestPresenter(response)
        super( presenter, [firstPipelineElement, secondPipelineElement])
    }
    validateRequestModel(requestModel: RequestModel): BaseErrorResponseModel | undefined {
        return undefined; 
    }
    validateFinalResponseModel(responseModel: BaseResponseModel): { isValid: boolean; errorModel?: BaseErrorResponseModel | undefined; } {
        const isValid = responseModel.status === 'success'
        const errorModel: BaseErrorResponseModel = {
            status: 'error',
            message: 'responseModel is not valid'
        }
        return {
            isValid: isValid,
            errorModel: isValid ? undefined : errorModel
        }
    }
    handleError(error: Error): void {
        throw new Error("handleError: found something!" + error.message);
        // if error is critical, throw it
        // if error is not critical, push it to the error stream
    }
}

describe('BaseMultiCallStreamableUseCase', () => {
    it('should execute successfully', async () => {
        const { req, res, session } = await createHttpMocks()
        const useCase = new TestMultiCallPipelineUseCase(res)

        const requestModel: RequestModel = {
            rucioAuthToken: 'does-not-matter',
        }
        useCase.execute(requestModel)

        const expectedResponse = {
            title: 'test'
        }


    })
})