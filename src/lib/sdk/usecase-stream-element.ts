import { Transform } from 'stream';
import { BaseDTO } from './dto';
import { BaseErrorResponseModel, BaseResponseModel } from './usecase-models';

export abstract class BaseMultiCallUseCasePipelineElement<TRequestModel, TResponseModel extends BaseResponseModel, TErrorModel extends BaseErrorResponseModel, TDTO extends BaseDTO> extends Transform {

    constructor() {
        super({ objectMode: true });
    }

    /**
     * Makes a gateway request with the given request model.
     * @param requestModel The request model to send to the gateway.
     * @returns A promise that resolves with the DTO returned by the gateway.
     */
    abstract makeGatewayRequest(requestModel: TRequestModel): Promise<TDTO>

    /**
     * Handles the DTO returned by the gateway.
     * This method is called when the gateway returns a DTO with a status of `success`.
     * @param dto The DTO returned by the gateway.
     * @returns An object that contains the response or error model and the status of processing the DTO.
     */
    abstract processDTO(dto: TDTO): {
        data: TResponseModel | TErrorModel
        status: 'success' | 'error'
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

    /**
     * Processes the response and DTO returned by the gateway.
     * @param response The DTO returned by the gateway.
     * @returns The ResponseModel or ErrorModel returned, based on processing of the DTO.
     */
    processGatewayResponse(response: TDTO): TResponseModel | TErrorModel {
        if (response.status === 'success') {
            const { status, data } = this.processDTO(response)
            if( status === 'success') {
                return data as TResponseModel
            }
            return data as TErrorModel
        }
        const errorModel: TErrorModel = this.handleGatewayError(response)
        return errorModel
    }

    async exceute(requestModel: TRequestModel, responseModel: TResponseModel): Promise<TResponseModel | TErrorModel> {
        const dto = await this.makeGatewayRequest(requestModel)
        const data: TResponseModel | TErrorModel = this.processGatewayResponse(dto)
        if(data.status === 'error') {
            return Promise.reject(data)
        }
        const transformedResponseModel = this.transformResponseModel(responseModel, dto)
        return Promise.resolve(transformedResponseModel)
    }

    _transform(chunk: any, encoding: BufferEncoding, callback: (error?: Error, data?: any | TErrorModel) => void): void {
        const parsedChunk = JSON.parse(chunk)
        const requestModel = parsedChunk.requestModel as TRequestModel
        const responseModel = parsedChunk.responseModel as TResponseModel // TODO create responseModel if not provided
        this.exceute(requestModel, responseModel).then((data) => {
            this.push(data)
            callback(undefined, data) // TODO check if data is not pushed twice
        }).catch((error) => {
            this.emit('error', error)
            callback(error)
        })
    }
}
