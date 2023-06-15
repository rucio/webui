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
 * @property status A string that indicates the status of the error response model. Must be `'error'`.
 * @property message A string that provides additional information about the error.
 */
export type BaseErrorResponseModel = {
    status: 'error';
    message: string;
}