import { PassThrough, Transform } from 'stream'
import { TResponse } from './web'

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
export interface BaseAuthenticatedInputPort<AuthenticatedRequestModel> {
    execute(requestModel: AuthenticatedRequestModel): Promise<void>
}

/**
 * A base interface for streamable input ports.
 * @typeparam AuthenticatedRequestModel The type of the authenticated request model for the input port.
 */
export interface BaseStreamableInputPort<AuthenticatedRequestModel>
    extends Transform {
    execute(requestModel: AuthenticatedRequestModel): Promise<void>
}

/**
 * A base interface for output ports.
 * @typeparam TResponseModel The type of the response model for the output port.
 * @typeparam TViewModel The type of the view model for the output port.
 * @typeparam TErrorModel The type of the error model for the output port.
 */
export interface BaseOutputPort<TResponseModel, TViewModel, TErrorModel> {
    response: TResponse
    presentSuccess(responseModel: TResponseModel): Promise<TViewModel>
    presentError(errorModel: TErrorModel): Promise<TViewModel>
}

/**
 * A base interface for streaming output ports.
 * @typeparam TViewModel The type of the view model for the streaming output port.
 * @typeparam TErrorModel The type of the error model for the streaming output port.
 */
export interface BaseStreamingOutputPort<TViewModel, TErrorModel> {
    response: TResponse
    presentStream(stream: PassThrough): Promise<TViewModel>
    presentError(errorModel: TErrorModel): Promise<TViewModel>
}