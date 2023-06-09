/**
 * This RequestModel can be extended by any use case that requires an authenticated user.
 * @type AuthenticatedUseCaseRequest
 * @property {string} rucioAuthToken - The Rucio Auth Token to be used for the request.
 */
export type AuthenticatedUseCaseRequest = {
    rucioAuthToken: string;
}

/**
 * This ResponseModel can be extended by any use case that requires an authenticated user.
 * @type AuthenticatedUseCaseResponse
 * @property {string} status - The status of the request.
 * @property {string} error - The error message if the request failed.
 */
export type AuthenticatedUseCaseResponse = {
    status: 'success' | 'error' | 'unauthorized';
}