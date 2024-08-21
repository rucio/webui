import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { BaseStreamingPostProcessingPipelineElement } from '@/lib/sdk/postprocessing-pipeline-elements';
import { TDTO, TRequestModel, TResponseModel } from './models';

export class FirstPipelineElement extends BaseStreamingPostProcessingPipelineElement<TRequestModel, TResponseModel, BaseErrorResponseModel, TDTO> {
    makeGatewayRequest(requestModel: TRequestModel, responseModel: TResponseModel): Promise<TDTO> {
        const dto: TDTO = {
            status: 'success',
            message: 'pipeline element 1',
        };
        return Promise.resolve(dto);
    }
    validateDTO(dto: TDTO): {
        data: TDTO | BaseErrorResponseModel;
        status: 'success' | 'error';
    } {
        return {
            status: 'success',
            data: dto,
        };
    }

    handleGatewayError(error: TDTO): BaseErrorResponseModel {
        throw new Error('Method not implemented.');
    }

    transformResponseModel(responseModel: TResponseModel, dto: TDTO): TResponseModel {
        const message = responseModel.message + ' ' + dto.message + ' transformed ';
        const transformedResponse: TResponseModel = {
            status: 'success',
            message: message,
        };
        return transformedResponse;
    }
}

export class SecondPipelineElement extends BaseStreamingPostProcessingPipelineElement<TRequestModel, TResponseModel, BaseErrorResponseModel, TDTO> {
    makeGatewayRequest(requestModel: TRequestModel, responseModel: TResponseModel): Promise<TDTO> {
        const dto: TDTO = {
            status: 'success',
            message: 'pipeline element 2',
        };
        return Promise.resolve(dto);
    }
    validateDTO(dto: TDTO): {
        data: TDTO | BaseErrorResponseModel;
        status: 'success' | 'error';
    } {
        return {
            status: 'success',
            data: dto,
        };
    }

    handleGatewayError(error: TDTO): BaseErrorResponseModel {
        throw new Error('Method not implemented.');
    }

    transformResponseModel(responseModel: TResponseModel, dto: TDTO): TResponseModel {
        const message = responseModel.message + dto.message + ' transformed';
        const transformedResponse: TResponseModel = {
            status: 'success',
            message: message,
        };
        return transformedResponse;
    }
}
