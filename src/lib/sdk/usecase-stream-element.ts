import { Transform, Readable, PassThrough } from 'stream';
import { BaseDTO, BaseStreamableDTO } from './dto';
import { BaseErrorResponseModel, BaseResponseModel } from './usecase-models';

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
     * @returns An object that contains the response or error model and the status of processing the DTO.
     */
    abstract processDTO(dto: TDTO): {
        status: 'success' | 'error' | 'critical'
        data: TResponseModel | TErrorModel
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
            const { status, data } = this.processDTO(dto)
            if(status === 'error') {
                this.emit('error', data)
                callback(data as Error)
            }
            const transformedResponseModel = this.transformResponseModel(responseModel, dto)
            // this.push({
            //         requestModel: requestModel,
            //         responseModel: transformedResponseModel
            //     }
            // )
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
