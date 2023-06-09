import {
    BaseAuthenticatedInputPort,
    BaseInputPort,
    BaseStreamableInputPort,
} from './primary-ports'
import { AuthenticatedRequestModel } from './usecase-models'

/**
 * A type that represents a simple use case that does not require authentication.
 * @typeparam TRequestModel The type of the request model for the use case.
 */
export type TBaseUseCase<TRequestModel> = BaseInputPort<TRequestModel>

/**
 * A type that represents an authenticated use case.
 * @typeparam TRequestModel The type of the request model for the use case.
 */
export type TAuthenticatedUseCase<TRequestModel> = BaseAuthenticatedInputPort<
    AuthenticatedRequestModel<TRequestModel>
>

/**
 * A type that represents a streamable use case. These usecases are always authenticated.
 * @typeparam TRequestModel The type of the request model for the use case.
 */
export type TStreamableUseCase<TRequestModel> = BaseStreamableInputPort<
    AuthenticatedRequestModel<TRequestModel>
>

/**
 * A type that represents any use case i.e {@link TBaseUseCase} or {@link TAuthenticatedUseCase} or {@link TStreamableUseCase}.
 * @typeparam TRequestModel The type of the request model for the use case.
 */
export type TUseCase<TRequestModel> =
    | TBaseUseCase<TRequestModel>
    | TAuthenticatedUseCase<TRequestModel>
    | TStreamableUseCase<TRequestModel>
