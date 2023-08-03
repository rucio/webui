import { BaseStreamableDTO } from "@/lib/sdk/dto";
import { BaseStreamingPostProcessingPipelineElement } from "@/lib/sdk/postprocessing-pipeline-elements";
import { BaseMultiCallStreamableUseCase } from "@/lib/sdk/usecase";
import { BaseErrorResponseModel } from "@/lib/sdk/usecase-models";
import { BaseViewModel } from "@/lib/sdk/view-models";
import { TRequestModel, TResponseModel, StreamDTO, TDTO } from "../fixtures/models";
import { FirstPipelineElement, SecondPipelineElement } from "../fixtures/pipeline-elements";
import { TestPresenter } from "../fixtures/presenter";
import { Readable } from "stream";
import { MockHttpStreamableResponseFactory } from "test/fixtures/http-fixtures";

describe("Post Processing Streaming Pipeline Error Handling", () => {
    class TestErrorInPipilineElementUseCase extends BaseMultiCallStreamableUseCase<
        TRequestModel,
        TResponseModel,
        BaseErrorResponseModel,
        BaseStreamableDTO,
        StreamDTO,
        BaseViewModel
    > {
        constructor(response: any) {
            const firstPipelineElement = new FirstPipelineElement()
            const secondPipelineElement = new SecondPipelineElement()
            const presenter = new TestPresenter(response)
            super(presenter, [firstPipelineElement, secondPipelineElement])
        }
        
        validateRequestModel(requestModel: { rucioAuthToken: string; }): BaseErrorResponseModel | undefined {
            return undefined;
        }
        makeGatewayRequest(requestModel: { rucioAuthToken: string; }): Promise<BaseStreamableDTO> {
            const mockDTOs: StreamDTO[] = [
                {
                    status: 'success',
                    title: 'root_element_1',
                },
                {
                    status: 'success',
                    title: 'root_element_2',
                },
            ]
            const dto: BaseStreamableDTO = {
                status: 'success',
                stream: Readable.from(mockDTOs),
            }
            return Promise.resolve(dto)
        }

        handleGatewayError(error: BaseStreamableDTO): BaseErrorResponseModel {
            throw new Error("Method not implemented.");
        }

        processStreamedData(dto: StreamDTO): { data: TResponseModel | BaseErrorResponseModel; status: "success" | "error"; } {
            const responseModel: TResponseModel = {
                status: 'success',
                message: dto.title,
            }
            return {
                status: 'success',
                data: responseModel,
            }
        }

        handleStreamError(error: BaseErrorResponseModel): void {
            throw new Error("Should not be called.");
        }

        validateFinalResponseModel(responseModel: TResponseModel): { isValid: boolean; errorModel?: BaseErrorResponseModel | undefined; } {
            if (responseModel.message === 'root_element_2 pipeline element 1 transformed pipeline element 2 transformed') {
                const error: BaseErrorResponseModel = {
                    status: 'error',
                    code: 400,
                    name: 'ValidationError',
                    message: 'Failed to validate response model',
                }
                return {
                    isValid: false,
                    errorModel: error,
                }
            }
            return {
                isValid: true,
            }
        }
    }

    it("should stream a Error ViewModel when an error occurs during final validation of response model", async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse()
        const useCase = new TestErrorInPipilineElementUseCase(res)
        const requestModel: TRequestModel = {
            rucioAuthToken: 'does not matter'
        }
        
        await useCase.execute(requestModel)
        const receivedData: any[] = []
        const onData = (data: string) => {
            receivedData.push(JSON.parse(data))
        }

        const done = new Promise<void>((resolve, reject) => {
            res.on('data', onData)
            res.on('end', () => {
                res.off('data', onData)
                resolve()
            })
            res.on('error', err => {
                res.off('data', onData)
                reject(err)
            })
        })

        await done
        console.log(receivedData)
        expect (receivedData).toEqual([
            {
                status: 'success',
                title: 'success: root_element_1 pipeline element 1 transformed pipeline element 2 transformed',
            },
            {
                status: 'error',
                title: 'failed: Failed to validate response model',
            }
        ])       

    })
})