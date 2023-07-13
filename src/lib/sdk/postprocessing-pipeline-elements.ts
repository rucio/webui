import { Transform } from 'stream';
import { BaseDTO } from './dto';
import { BaseErrorResponseModel, BaseResponseModel } from './usecase-models';
import { TransformCallback } from 'stream';

/**
 * A base class for post-processing pipeline elements in a synchronous use case.
 * @typeparam TRequestModel The type of the request model for the use case.
 * @typeparam TResponseModel The type of the response model for the use case.
 * @typeparam TErrorModel The type of the error model for the use case.
 * @typeparam TDTO The type of the data transfer object for the use case.
 */
export abstract class BasePostProcessingPipelineElement<TRequestModel, TResponseModel extends BaseResponseModel, TErrorModel extends BaseErrorResponseModel, TDTO extends BaseDTO> {
    /**
     * Make a gateway request to obtain additional data for enriching the response model.
     * @param requestModel The requestModel for the parent use case.
     * @param responseModel The responseModel from the previous pipeline element.
     */
    abstract makeGatewayRequest(requestModel: TRequestModel, responseModel: TResponseModel): Promise<TDTO>
    
    /**
     * Validate the DTO returned by the gateway.
     * @param dto The DTO returned by the gateway.
     * @returns An object that contains the status of the DTO and the DTO itself or an error model.
     */
    abstract validateDTO(dto: TDTO): {
        status: 'success' | 'error' | 'critical'
        data: TDTO | TErrorModel
    }
    
    /**
     * Handle a gateway error by converting it to an error model.
     * @param error The DTO returned by the gateway.
     */
    abstract handleGatewayError(error: TDTO): TErrorModel

    /**
     * Modifies the response model of the use case with the data returned by the gateway.
     * @param responseModel The response model to transform.
     * @param dto The valid DTO returned by the gateway.
     * @returns The transformed response model.
     */
    abstract transformResponseModel(responseModel: TResponseModel, dto: TDTO): TResponseModel

    async execute(requestModel: TRequestModel, responseModel: TResponseModel): Promise<TResponseModel | TErrorModel> {
        const dto = await this.makeGatewayRequest(requestModel, responseModel)
        if (dto.status === 'error') {
            return this.handleGatewayError(dto)
        }
        const { status, data } = this.validateDTO(dto)
        if(status === 'error') {
            return data as TErrorModel
        }

        const transformedResponseModel = this.transformResponseModel(responseModel, dto)
        return transformedResponseModel
    }
}

/**
 * A base class for post-processing pipeline elements in a streaming use case.
 * @typeparam TRequestModel The type of the request model for the use case.
 * @typeparam TResponseModel The type of the response model for the use case.
 * @typeparam TErrorModel The type of the error model for the use case.
 * @typeparam TDTO The type of the data transfer object for the use case.
 */
export abstract class BaseStreamingPostProcessingPipelineElement<TRequestModel, TResponseModel extends BaseResponseModel, TErrorModel extends BaseErrorResponseModel, TDTO extends BaseDTO> extends Transform {

    constructor() {
        super({ objectMode: true });
    }

    /**
     * Makes a gateway request with the given request model.
     * @param requestModel The request model to send to the gateway.
     * @param responseModel The response model to transform. The response model is recieved from the previous pipeline element.
     * @returns A promise that resolves with the DTO returned by the gateway.
     */
    abstract makeGatewayRequest(requestModel: TRequestModel, responseModel: TResponseModel): Promise<TDTO>

    /**
     * Handles the individual DTO object returned by the gateway's response stream.
     * @param dto The DTO returned by the gateway.
     * @returns An object that contains the DTO or error model and the status of processing the DTO.
     */
    abstract validateDTO(dto: TDTO): {
        status: 'success' | 'error' | 'critical'
        data: TDTO | TErrorModel
    }

    /**
     * Handles a gateway error by converting it to an error model.
     * This method is called when the gateway returns a DTO with a status of `error`.
     * @param error The DTO returned by the gateway.
     * @returns An error model that represents the gateway error.
     */
    abstract handleGatewayError(error: TDTO): TErrorModel

    /**
     * Modifies the response model of the use case with the data returned by the gateway.
     * @param responseModel The response model to transform.
     * @param dto The valid DTO returned by the gateway.
     */
    abstract transformResponseModel(responseModel: TResponseModel, dto: TDTO): TResponseModel

    async _transform(chunk: {requestModel: TRequestModel, responseModel: TResponseModel}, encoding: BufferEncoding, callback: (error?: Error, data?: any | TErrorModel) => void): Promise<void> {
        const { requestModel, responseModel } = chunk
        const dto = await this.makeGatewayRequest(requestModel, responseModel)
        try {
            if (dto.status === 'error') {
                const errorModel: TErrorModel = this.handleGatewayError(dto)
                this.emit('error', errorModel)
                callback()
            }
            const { status, data } = this.validateDTO(dto)
            if(status === 'error') {
                this.emit('error', data)
                callback(data as Error)
            }
            const transformedResponseModel = this.transformResponseModel(responseModel, dto)
            callback(undefined, {
                requestModel: requestModel,
                responseModel: transformedResponseModel
            })
        } catch (error: Error | any) {
            this.emit('Unknown error with Gateway Request: ', error)
            callback(error? error: undefined)
        }
    }
}


/**
 * A base class for the final validation stage in a post processing streaming pipeline.
 */
export class BaseResponseModelValidatorPipelineElement<TResponseModel extends BaseResponseModel, TErrorModel> extends Transform {
    protected validatorFn: {(responseModel: TResponseModel): {isValid: boolean, errorModel?: TErrorModel | undefined}}

    constructor(validatorFn:{(responseModel: TResponseModel): {isValid: boolean, errorModel?: TErrorModel | undefined}}) {
        super({ objectMode: true })
        this.validatorFn = validatorFn
    }

    validateResponseModel(responseModel: TResponseModel): {
        isValid: boolean
        errorModel?: TErrorModel | undefined
    } {
        return this.validatorFn(responseModel)
    } 

    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
        const { responseModel } = chunk
        const validationResult = this.validateResponseModel(responseModel)
        if (validationResult.isValid) {
            callback(undefined, responseModel)
        } else {
            this.emit('error', validationResult.errorModel)
            callback(validationResult.errorModel as Error)
        }
    }
}