import { BaseDTO, BaseStreamableDTO } from '@/lib/sdk/dto'
import { BaseStreamingPresenter } from '@/lib/sdk/presenter'
import { BaseMultiCallStreamableUseCase } from '@/lib/sdk/usecase'
import {
    AuthenticatedRequestModel,
    BaseErrorResponseModel,
    BaseResponseModel,
} from '@/lib/sdk/usecase-models'
import { BaseStreamingPostProcessingPipelineElement } from '@/lib/sdk/usecase-stream-element'
import { Readable, Transform, PassThrough } from 'stream'
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures'

describe('BaseMultiCallStreamableUseCase', () => {
    type RequestModel = AuthenticatedRequestModel<{}>
    interface TResponseModel extends BaseResponseModel {
        message: string
    }

    type StreamData = {
        title: string
    }
    class FirstPipelineElement extends BaseStreamingPostProcessingPipelineElement<
        RequestModel,
        TResponseModel,
        BaseErrorResponseModel,
        BaseDTO
    > {
        makeGatewayRequest(
            requestModel: RequestModel,
            responseModel: TResponseModel,
        ): Promise<BaseDTO> {
            const dto: BaseDTO = {
                status: 'success',
                message: 'pipeline element 1',
            }
            return Promise.resolve(dto)
        }
        processDTO(dto: BaseDTO): {
            data: TResponseModel | BaseErrorResponseModel
            status: 'success' | 'error'
        } {
            return {
                status: 'success',
                data: {
                    status: 'success',
                    message: dto.message,
                } as TResponseModel,
            }
        }

        handleGatewayError(error: BaseDTO): BaseErrorResponseModel {
            throw new Error('Method not implemented.')
        }

        transformResponseModel(
            responseModel: TResponseModel,
            dto: BaseDTO,
        ): TResponseModel {
            const message = dto.message + ' transformed!\n'
            const transformedResponse: TResponseModel = {
                status: 'success',
                message: message,
            }
            return transformedResponse
        }
    }

    class SecondPipelineElement extends BaseStreamingPostProcessingPipelineElement<
        RequestModel,
        BaseResponseModel,
        BaseErrorResponseModel,
        BaseDTO
    > {
        makeGatewayRequest(
            requestModel: RequestModel,
            responseModel: TResponseModel,
        ): Promise<BaseDTO> {
            const dto: BaseDTO = {
                status: 'success',
                message: 'pipeline element 2',
            }
            return Promise.resolve(dto)
        }
        processDTO(dto: BaseDTO): {
            data: TResponseModel | BaseErrorResponseModel
            status: 'success' | 'error'
        } {
            return {
                status: 'success',
                data: {
                    status: 'success',
                    message: dto.message,
                } as TResponseModel,
            }
        }

        handleGatewayError(error: BaseDTO): BaseErrorResponseModel {
            throw new Error('Method not implemented.')
        }

        transformResponseModel(
            responseModel: TResponseModel,
            dto: BaseDTO,
        ): TResponseModel {
            const message = responseModel.message + dto.message + ' transformed!\n'
            const transformedResponse: TResponseModel = {
                status: 'success',
                message: message,
            }
            return transformedResponse
        }
    }

    class TestPresenter extends BaseStreamingPresenter<
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
            responseModel: BaseResponseModel,
        ): StreamData {
            return {
                title: 'success: ' + responseModel.status,
            }
        }
    }

    class TestMultiCallPipelineUseCase extends BaseMultiCallStreamableUseCase<
        RequestModel,
        TResponseModel,
        BaseErrorResponseModel,
        BaseStreamableDTO,
        StreamData
    > {
        makeGatewayRequest(requestModel: {
            rucioAuthToken: string
        }): Promise<BaseStreamableDTO> {
            const dto: BaseStreamableDTO = {
                status: 'success',
                stream: Readable.from(['root_element_1', 'root_element_2']),
            }
            return Promise.resolve(dto)
        }

        handleGatewayError(error: BaseStreamableDTO): BaseErrorResponseModel {
            throw new Error('Method not implemented.')
        }

        processStreamedData(dto: StreamData): {
            data: TResponseModel | BaseErrorResponseModel
            status: 'success' | 'error'
        } {
            const responseModel: TResponseModel = {
                status: 'success',
                message: dto.title,
            }
            return {
                status: 'success',
                data: responseModel,
            }
        }

        constructor(response: any) {
            const firstPipelineElement = new FirstPipelineElement()
            const secondPipelineElement = new SecondPipelineElement()
            const presenter = new TestPresenter(response)
            super(presenter, [firstPipelineElement, secondPipelineElement])
        }

        validateRequestModel(
            requestModel: RequestModel,
        ): BaseErrorResponseModel | undefined {
            return undefined
        }

        validateFinalResponseModel(responseModel: BaseResponseModel): {
            isValid: boolean
            errorModel?: BaseErrorResponseModel | undefined
        } {
            const isValid = responseModel.status === 'success'
            const errorModel: BaseErrorResponseModel = {
                name: 'Validation Error',
                status: 'error',
                message: 'responseModel is not valid',
            }
            return {
                isValid: isValid,
                errorModel: isValid ? undefined : errorModel,
            }
        }

        handleStreamError(error: BaseErrorResponseModel): void {
            throw new Error('handleError: found something!' + error.message)
        }
    }

    it('should execute successfully', async () => {
        // const res = new Transform({
        //     objectMode: true,
        //     transform: (chunk, encoding, callback) => {
        //         console.log('transforming chunk: ' + chunk)
        //         callback(undefined, chunk)
        //     },
        // })
        const res = MockHttpStreamableResponseFactory.getMockResponse()
        const useCase = new TestMultiCallPipelineUseCase(res)

        const requestModel: RequestModel = {
            rucioAuthToken: 'does-not-matter',
        }

        await useCase.execute(requestModel)

        const receivedData: any[] = []
        const onData = (data: string) => {
            receivedData.push(data)
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
        expect(receivedData).toEqual([
            {
                title: 'success: success',
            },
            {
                title: 'success: success',
            }
        ])
    })

    class Validator extends Transform{
        constructor() {
            super({ objectMode: true })
        }
        _transform(chunk: any, encoding: BufferEncoding, callback: (error?: Error, data?: any) => void): void {
            console.log('validating chunk: ' + chunk)
            this.push(chunk)
            callback()
        }
    }
    it('tests piping', async () => {
        const baseStream = Readable.from(['root_element_1', 'root_element_2'])

        const firstPipelineElement = new PassThrough({ objectMode: true })
        const secondPipelineElement = new PassThrough({ objectMode: true })
        // const validator = new Transform({
        //     objectMode: true,
        //     transform: (chunk, encoding, callback) => {
        //         console.log('validating chunk: ' + chunk)
        //         callback(undefined, chunk)
        //     },
        // }) 

        const validator = new Validator()

        const res = new Transform({
            objectMode: true,
            transform: (chunk, encoding, callback) => {
                console.log('transforming chunk: ' + chunk)
                callback(undefined, chunk)
            },
        })

        baseStream.on('error', (error) => console.log(error)).pipe(firstPipelineElement)
        firstPipelineElement.on('error', (error) => console.log(error)).pipe(secondPipelineElement)
        secondPipelineElement.pipe(validator)
        validator.on('error', (error) => console.log(error)).pipe(res)

        const receivedData: string[] = []
        const onData = (data: string) => {
            receivedData.push(data.toString())
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

        expect(receivedData).toEqual(['root_element_1', 'root_element_2'])
    })
})
