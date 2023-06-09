/**
 * A type that represents an authenticated request model.
 * @typeparam TRequestModel The type of the request model which must include rucioAuthToken key.
 * @remarks
 * The rucioAuthToken is made available by the session
 */
export type AuthenticatedRequestModel<TRequestModel> = TRequestModel & { rucioAuthToken: string }
