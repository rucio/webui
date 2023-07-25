import { BaseStreamableDTO } from "@/lib/sdk/dto";
import { BaseStreamingUseCase } from "@/lib/sdk/usecase";
import { BaseErrorResponseModel } from "@/lib/sdk/usecase-models";
import { BaseViewModel } from "@/lib/sdk/view-models";
import { MockHttpStreamableResponseFactory } from "test/fixtures/http-fixtures";
import MockRucioServerFactory from "test/fixtures/rucio-server";
import { TRequestModel, StreamDTO, TResponseModel, ViewModel } from "./fixtures/models";
import { TestPresenter } from "./fixtures/presenter";
import { Readable } from "stream";


describe("Stream Error Handling", () => {
    class TestStreamErrorUseCase extends BaseStreamingUseCase<TRequestModel, TResponseModel, BaseErrorResponseModel, BaseStreamableDTO, StreamDTO, BaseViewModel > {
        
        constructor(response: any) {
            const presenter = new TestPresenter(response)
            super(presenter);
        }

        validateRequestModel(requestModel: { rucioAuthToken: string; }): BaseErrorResponseModel | undefined {
            return undefined;
        }
        makeGatewayRequest(requestModel: { rucioAuthToken: string; }): Promise<BaseStreamableDTO> {
            if(requestModel.rucioAuthToken !== MockRucioServerFactory.VALID_RUCIO_TOKEN){
                return Promise.resolve({
                    status: "error",
                    errorType: "gateway_endpoint_error",
                    errorCode: 401,
                    errorMessage: "Failed to authenticate user",
                    stream: null,
                });
            }
            const mockDTOs: StreamDTO[] = [
                {
                    status: 'success',
                    title: 'root_element_1',
                },
                {
                    status: 'success',
                    title: 'root_element_2',
                },
                {
                    status: 'error',
                    title: 'invalid',
                    errorCode: 400,
                }
            ]

            return Promise.resolve({
                status: "success",
                code: 200,
                stream: Readable.from(mockDTOs)
            });
        }

        handleGatewayError(error: BaseStreamableDTO): BaseErrorResponseModel {
            throw new Error("Method not implemented.");
        }

        processStreamedData(dto: StreamDTO): { data: TResponseModel | BaseErrorResponseModel; status: "success" | "error"; } {
            if(dto.title === "invalid"){
                return {
                    data: {
                        code: 400,
                        name: "Not Found",
                        status: "error",
                        message: "Failed to process data"
                    },
                    status: "error"
                }
            }
            return {
                data: {
                    status: "success",
                    message: dto.title
                },
                status: "success"
            }
        }

    }
    it("Should return an error ViewModel for request made to stream endpoint", async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse()
        const useCase = new TestStreamErrorUseCase(res)

        const requestModel: TRequestModel = {
            rucioAuthToken: 'does-not-matter',
        }

        await useCase.execute(requestModel)

        expect(res.statusCode).toBe(401)
        const errorViewModel: ViewModel = await JSON.parse(res._getData())
        expect(errorViewModel.status).toBe('error')
        expect(errorViewModel.title).toBe('failed: Failed to authenticate user')
    })

    it("Should return an error ViewModel for individual stream elements that are invalid", async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse()
        const useCase = new TestStreamErrorUseCase(res)

        const requestModel: TRequestModel = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
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
        expect(receivedData.length).toBe(3)
        expect(receivedData[2].status).toBe('error')
        expect(receivedData[2].title).toBe('failed: Failed to process data')
    })
});