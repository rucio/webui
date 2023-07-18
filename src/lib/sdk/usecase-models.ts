/**
 * A type that represents an authenticated request model.
 * @typeparam TRequestModel The type of the request model which must include rucioAuthToken key.
 * @remarks
 * The rucioAuthToken is made available by the session
 */
export type AuthenticatedRequestModel<TRequestModel> = TRequestModel & { rucioAuthToken: string }

/**
 * A base type for response models.
 * @property status A string that indicates the status of the response model. Must be `'success'`.
 */
export type BaseResponseModel = {
    status: 'success';
}

/**
 * A base type for error response models.
 * @property status A string that indicates the status of the error response model. Must be `'error'` or `'critical'`, the latter indicating that the further requests in a pipeline must be canceled.
 * @property message An object of type { code: number, message: string} or a string that provides additional information about the error.
 * @remarks The `message` property in the object form should be used when the response code from gateway should be forwarded to the view models.
 * @remarks The `message` property in the string form should be used if manual handling of errors must be done in the use case and presenter.
 */
export interface BaseErrorResponseModel {
    status: 'error' | 'critical';
    message: { code: number; message: string; } | string;
}