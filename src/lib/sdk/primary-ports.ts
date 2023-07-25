import { PassThrough, Transform } from 'stream'
import { BaseDTO } from './dto'
import { AuthenticatedRequestModel, BaseErrorResponseModel, BaseResponseModel } from './usecase-models'
import { BaseStreamingPostProcessingPipelineElement } from './postprocessing-pipeline-elements'
import { TWebResponse } from './web'
import { BaseViewModel } from './view-models'

/**
 * A base interface for input ports.
 * @typeparam TRequestModel The type of the request model for the input port.
 */
export interface BaseInputPort<TRequestModel> {
    execute(requestModel: TRequestModel): Promise<void>
}

/**
 * A base interface for authenticated input ports.
 * @typeparam AuthenticatedRequestModel The type of the authenticated request model for the input port.
 */
export interface BaseAuthenticatedInputPort<TRequestModel> {
    execute(requestModel: AuthenticatedRequestModel<TRequestModel>): Promise<void>
}

/**
 * A base interface for streamable input ports.
 * @typeparam AuthenticatedRequestModel The type of the authenticated request model for the input port.
 * @deprecated Primary Input Ports should not be streamable!! Use {@link BaseAuthenticatedInputPort} instead.
 */
export interface BaseStreamableInputPort<AuthenticatedRequestModel>
    extends Transform {
    execute(requestModel: AuthenticatedRequestModel): Promise<void>
}

/**
 * A base interface for multi-call streamable input ports. A streamable input port provides a pipeline of {@link BaseStreamingPostProcessingPipelineElement} elements that are used to process the request model.
 * These pipeline elements recieve the request model and the latest response model and return a new response model.
 * The pipeline elements are executed in the order they are provided.
 * @typeparam AuthenticatedRequestModel The type of the authenticated request model for the input port.
 * @typeparam TResponseModel The type of the response model for the input port.
 * @typeparam TErrorModel The type of the error model for the input port.
 */
export interface BaseMultiCallStreamableInputPort<AuthenticatedRequestModel, TResponseModel extends BaseResponseModel, TErrorModel extends BaseErrorResponseModel>{
    /**
     * Validates the final response model.
     * @param responseModel The response model to validate.
     */
    validateFinalResponseModel(responseModel: TResponseModel): {
        isValid: boolean,
        errorModel?: TErrorModel
    }
}

/**
 * A base interface for output ports.
 * @typeparam TResponseModel The type of the response model for the output port.
 * @typeparam TErrorModel The type of the error model for the output port.
 */
export interface BaseOutputPort<TResponseModel, TErrorModel> {
    response: TWebResponse
    presentSuccess(responseModel: TResponseModel): Promise<void>
    presentError(errorModel: TErrorModel): Promise<void>
}

/**
 * A base interface for streaming output ports.
 * @typeparam TResponseModel The type of the response model for the streaming output port.
 * @typeparam TErrorModel The type of the error model for the streaming output port.
 * @typeparam TStreamViewModel The type of the view model for the streamed data.
 */
export interface BaseStreamingOutputPort<TResponseModel extends BaseResponseModel, TErrorModel extends BaseErrorResponseModel, TStreamViewModel extends BaseViewModel> extends Transform{
    response: TWebResponse
    
    setupStream(stream: PassThrough): void
    
    presentError(errorModel: TErrorModel): void
    
    convertErrorModelToViewModel(errorModel: TErrorModel): {
        status: number,
        viewModel: TStreamViewModel
    }
    
    streamResponseModelToViewModel(
        responseModel: TResponseModel,
    ): TStreamViewModel

    streamErrorModelToViewModel(error: TErrorModel): TStreamViewModel
}