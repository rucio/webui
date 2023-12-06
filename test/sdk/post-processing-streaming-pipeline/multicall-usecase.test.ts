import { BaseStreamableDTO } from '@/lib/sdk/dto'
import { BaseSingleEndpointPostProcessingPipelineStreamingUseCase } from '@/lib/sdk/usecase'
import {
    BaseErrorResponseModel,
    BaseResponseModel,
} from '@/lib/sdk/usecase-models'
import { BaseStreamingPostProcessingPipelineElement } from '@/lib/sdk/postprocessing-pipeline-elements'
import { Readable, Transform, PassThrough } from 'stream'
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures'
import { TRequestModel as TRequestModel, StreamDTO, TResponseModel } from '../fixtures/models'
import {
    FirstPipelineElement,
    SecondPipelineElement,
} from '../fixtures/pipeline-elements'
import { TestPresenter } from '../fixtures/presenter'
import { BaseViewModel } from '@/lib/sdk/view-models'

describe('BaseMultiCallStreamableUseCase', () => {
    class TestMultiCallPipelineUseCase extends BaseSingleEndpointPostProcessingPipelineStreamingUseCase<
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

        validateRequestModel(
            requestModel: TRequestModel,
        ): BaseErrorResponseModel | undefined {
            return undefined
        }

        async intializeRequest(request: { rucioAuthToken: string }): Promise<BaseErrorResponseModel | undefined> {
            return undefined
        }

        makeGatewayRequest(requestModel: {
            rucioAuthToken: string
        }): Promise<BaseStreamableDTO> {
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
            throw new Error('Method not implemented.')
        }
        

        processStreamedData(dto: StreamDTO): {
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


        validateFinalResponseModel(responseModel: BaseResponseModel): {
            isValid: boolean
            errorModel?: BaseErrorResponseModel | undefined
        } {
            const isValid = responseModel.status === 'success'
            const errorModel: BaseErrorResponseModel = {
                code: 400,
                name: 'Validation Error',
                status: 'error',
                message: 'responseModel is not valid',
            }
            return {
                isValid: isValid,
                errorModel: isValid ? undefined : errorModel,
            }
        }

        
    }

    it('should execute successfully', async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse()
        const useCase = new TestMultiCallPipelineUseCase(res)

        const requestModel: TRequestModel = {
            rucioAuthToken: 'does-not-matter',
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
        expect(receivedData).toEqual([
            {
                status: 'success',
                title: 'success: root_element_1 pipeline element 1 transformed pipeline element 2 transformed',
            },
            {
                status: 'success',
                title: 'success: root_element_2 pipeline element 1 transformed pipeline element 2 transformed',
            },
        ])
    })

    class Validator extends Transform {
        constructor() {
            super({ objectMode: true })
        }
        _transform(
            chunk: any,
            encoding: BufferEncoding,
            callback: (error?: Error, data?: any) => void,
        ): void {
            console.log('validating chunk: ' + chunk)
            this.push(chunk)
            callback()
        }
    }
    it('tests piping', async () => {
        const baseStream = Readable.from(['root_element_1', 'root_element_2'])

        const firstPipelineElement = new PassThrough({ objectMode: true })
        const secondPipelineElement = new PassThrough({ objectMode: true })
        const validator = new Validator()

        const res = new Transform({
            objectMode: true,
            transform: (chunk, encoding, callback) => {
                console.log('transforming chunk: ' + chunk)
                callback(undefined, chunk)
            },
        })

        baseStream
            .on('error', error => console.log(error))
            .pipe(firstPipelineElement)
        firstPipelineElement
            .on('error', error => console.log(error))
            .pipe(secondPipelineElement)
        secondPipelineElement.pipe(validator)
        validator.on('error', error => console.log(error)).pipe(res)

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
