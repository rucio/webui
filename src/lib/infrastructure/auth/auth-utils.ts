import { BaseDTO } from "@/lib/common/base-components/dto";
import { AuthError, RucioTokenExpiredError } from "@/lib/core/data/auth-exceptions";
import { SessionUser } from "@/lib/core/entity/auth-models";
import { IronSession } from "iron-session";
import { Response } from "node-fetch";

/**
 * A decorator for Gateway functions that need to make authenticated calls to Rucio Server
 * This checks if the user is authenticated with a valid rucio token and if so, passes the token to the function
 * @param session The {@link IronSession} object containing the session user
 * @returns The decorated function
 * @throws AuthError if the user is not present in the session
 * @throws RucioTokenExpiredError if the user is authenticated but the rucio token has expired
 */
export function withRucioAuth(session: IronSession, wrappedAsyncFunction: any){
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function(...args: any[]) {
            if(!session.user) {
                return new Promise((resolve, reject) => reject(new AuthError("User not authenticated")))
            }
            if(!session.user.rucioAuthToken) {
                return new Promise((resolve, reject) => reject(new AuthError("Rucio Auth Token not found")))
            }
            const rucioAuthToken = session.user.rucioAuthToken
            const rucioAuthTokenExpiresAt = session.user.rucioAuthTokenExpires
            const expirationTime = new Date(rucioAuthTokenExpiresAt).getTime()
            const currentTime = new Date().getTime()
            const timeLeft = expirationTime - currentTime
            if(timeLeft < 0) {
                return new Promise((resolve, reject) => reject(new RucioTokenExpiredError("Rucio Auth Token expired")))
            }
            return originalMethod.apply(this, args, rucioAuthToken);
        };
        return descriptor;
    }
}


/**
 * 
 * @param user The currently active {@link SessionUser} object
 * @returns Rucio Auth Token for the current {@link SessionUser} or throws an error
 * @throws AuthError if the user is not present in the session
 * @throws RucioTokenExpiredError if the user is authenticated but the rucio token has expired
 */
export function validateRucioToken(user: SessionUser) {
    const rucioAuthToken = user.rucioAuthToken
    const rucioAuthTokenExpiresAt = user.rucioAuthTokenExpires
    const expirationTime = new Date(rucioAuthTokenExpiresAt).getTime()
    const currentTime = new Date().getTime()
    const timeLeft = expirationTime - currentTime
    if(timeLeft < 0) {
        throw new RucioTokenExpiredError("Rucio Auth Token expired")
    }
    return rucioAuthToken
}

/**
 * Parses the response from an API endpoint and returns a `BaseDTO` object if the response status is 401 (Unauthorized).
 * @param response The response object returned by the API.
 * @returns A promise that resolves to a `BaseDTO` object if the response status is 401, or `undefined` otherwise.
 */
export async function handleAuthErrors(response: Response): Promise<BaseDTO | undefined> {
    if(response.status === 401) {
        const message = await response.json()
        const dto: BaseDTO = {
            status: 'error',
            message: message, 
        }
        return Promise.resolve(dto)
    }
    return Promise.resolve(undefined)
}