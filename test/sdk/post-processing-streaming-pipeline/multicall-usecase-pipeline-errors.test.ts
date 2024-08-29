import { BaseStreamableDTO } from '@/lib/sdk/dto';
import { BaseStreamingPostProcessingPipelineElement } from '@/lib/sdk/postprocessing-pipeline-elements';
import { BaseSingleEndpointPostProcessingPipelineStreamingUseCase } from '@/lib/sdk/usecase';
import { BaseErrorResponseModel } from '@/lib/sdk/usecase-models';
import { BaseViewModel } from '@/lib/sdk/view-models';
import { TRequestModel, TResponseModel, StreamDTO, TDTO } from '../fixtures/models';
import { SecondPipelineElement } from '../fixtures/pipeline-elements';
import { TestPresenter } from '../fixtures/presenter';
import { Readable } from 'stream';
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures';

describe('Post Processing Streaming Pipeline Error Handling', () => {
    class DiscardingPipelineElement extends BaseStreamingPostProcessingPipelineElement<TRequestModel, TResponseModel, BaseErrorResponseModel, TDTO> {
        makeGatewayRequest(requestModel: { rucioAuthToken: string }, responseModel: TResponseModel): Promise<TDTO> {
            return Promise.resolve({
                status: 'error',
                errorCode: 401,
                errorType: 'gateway_endpoint_error',
                errorMessage: 'Failed to authenticate user',
            } as TDTO);
        }

        handleGatewayError(error: TDTO): BaseErrorResponseModel {
            throw new Error('Should not be called.');
        }

        transformResponseModel(responseModel: TResponseModel, dto: TDTO): TResponseModel | BaseErrorResponseModel {
            if (dto.status === 'error') return dto as BaseErrorResponseModel;
            return responseModel;
        }
    }

    class OptionalResponsePipelineElement extends BaseStreamingPostProcessingPipelineElement<
        TRequestModel,
        TResponseModel,
        BaseErrorResponseModel,
        TDTO
    > {
        makeGatewayRequest(requestModel: { rucioAuthToken: string }, responseModel: TResponseModel): Promise<TDTO> {
            return Promise.resolve({
                status: 'error',
                errorCode: 401,
                errorType: 'gateway_endpoint_error',
                errorMessage: 'Failed to authenticate user',
            } as TDTO);
        }

        handleGatewayError(error: TDTO): BaseErrorResponseModel {
            throw new Error('Should not be called.');
        }

        transformResponseModel(responseModel: TResponseModel, dto: TDTO): TResponseModel | BaseErrorResponseModel {
            return responseModel;
        }
    }

    class TestErrorInPipilineElementUseCase extends BaseSingleEndpointPostProcessingPipelineStreamingUseCase<
        TRequestModel,
        TResponseModel,
        BaseErrorResponseModel,
        BaseStreamableDTO,
        StreamDTO,
        BaseViewModel
    > {
        constructor(
            response: any,
            errorPipelineElement: BaseStreamingPostProcessingPipelineElement<TRequestModel, TResponseModel, BaseErrorResponseModel, TDTO>,
        ) {
            const validPipelineElement = new SecondPipelineElement();
            const presenter = new TestPresenter(response);
            super(presenter, [validPipelineElement, errorPipelineElement]);
        }

        validateRequestModel(requestModel: { rucioAuthToken: string }): BaseErrorResponseModel | undefined {
            return undefined;
        }

        async intializeRequest(request: { rucioAuthToken: string }): Promise<BaseErrorResponseModel | undefined> {
            return undefined;
        }

        makeGatewayRequest(requestModel: { rucioAuthToken: string }): Promise<BaseStreamableDTO> {
            const mockDTOs: StreamDTO[] = [
                {
                    status: 'success',
                    title: 'root_element_1',
                },
                {
                    status: 'success',
                    title: 'root_element_2',
                },
            ];
            const dto: BaseStreamableDTO = {
                status: 'success',
                stream: Readable.from(mockDTOs),
            };
            return Promise.resolve(dto);
        }

        handleGatewayError(error: BaseStreamableDTO): BaseErrorResponseModel {
            throw new Error('Method not implemented.');
        }

        processStreamedData(dto: StreamDTO): { data: TResponseModel | BaseErrorResponseModel; status: 'success' | 'error' } {
            const responseModel: TResponseModel = {
                status: 'success',
                message: dto.title,
            };
            return {
                status: 'success',
                data: responseModel,
            };
        }

        validateFinalResponseModel(responseModel: TResponseModel): { isValid: boolean; errorModel?: BaseErrorResponseModel | undefined } {
            // Should be called only once
            return {
                isValid: true,
            };
        }
    }

    it('should stream a Error ViewModel when an error occurs in a pipeline element and its response is not optional', async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse();
        const useCase = new TestErrorInPipilineElementUseCase(res, new DiscardingPipelineElement());
        const requestModel: TRequestModel = {
            rucioAuthToken: 'does not matter',
        };

        await useCase.execute(requestModel);
        const receivedData: any[] = [];
        const onData = (data: string) => {
            receivedData.push(JSON.parse(data));
        };

        const done = new Promise<void>((resolve, reject) => {
            res.on('data', onData);
            res.on('end', () => {
                res.off('data', onData);
                resolve();
            });
            res.on('error', err => {
                res.off('data', onData);
                reject(err);
            });
        });

        await done;
        console.log(receivedData);
        expect(receivedData).toEqual([
            {
                status: 'error',
                title: 'failed: Failed to authenticate user',
            },
            {
                status: 'error',
                title: 'failed: Failed to authenticate user',
            },
        ]);
    });

    it('should stream a success ViewModel when an error occurs in a pipeline element but its response is optional', async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse();
        const useCase = new TestErrorInPipilineElementUseCase(res, new OptionalResponsePipelineElement());
        const requestModel: TRequestModel = {
            rucioAuthToken: 'does not matter',
        };

        await useCase.execute(requestModel);
        const receivedData: any[] = [];
        const onData = (data: string) => {
            receivedData.push(JSON.parse(data));
        };

        const done = new Promise<void>((resolve, reject) => {
            res.on('data', onData);
            res.on('end', () => {
                res.off('data', onData);
                resolve();
            });
            res.on('error', err => {
                res.off('data', onData);
                reject(err);
            });
        });

        await done;
        expect(receivedData).toEqual([
            {
                status: 'success',
                title: 'success: root_element_1pipeline element 2 transformed',
            },
            {
                status: 'success',
                title: 'success: root_element_2pipeline element 2 transformed',
            },
        ]);
    });
});
