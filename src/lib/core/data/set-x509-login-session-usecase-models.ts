import { VO } from "../entity/auth-models"
import SetX509LoginSessionOutputPort from "../port/primary/set-x509-login-session-output-port"

/**
 * Request Model for {@link SetX509LoginSessionInputPort}
 * @property {string} rucioAuthToken - Rucio Auth Token retrieved after a successful x509 login
 * @property {string} rucioAccount - Rucio Account retrieved after a successful x509 login
 * @property {string} shortVOName - Short name of the VO to which the user belongs
 * @property {string} rucioAuthTokenExpires - Expiry time of the Rucio Auth Token
 */
export type SetX509LoginSessionRequest = {
    rucioAuthToken: string
    rucioAuthTokenExpires: string
    rucioAccount: string
    shortVOName: string  
}

/**
 * Response Model for {@link SetX509LoginSessionOutputPort}
 * @property {boolean} isLoggedIn - true if the user is logged in
 * @property {string} rucioIdentity - Rucio Identity of the user extracted from the token
 * @property {VO} vo - VO to which the user belongs
 */
export interface SetX509LoginSessionResponse extends SetX509LoginSessionRequest {
    isLoggedIn: boolean
    rucioIdentity: string
    vo: VO
}

/**
 * Error Model for {@link SetX509LoginSessionOutputPort}
 * @property {string} type - Type of error:
 * 'InvalidVO': If the VO is not found in the list of configured VOs
 * 'InvalidToken': If the token is invalid i.e. we could not extract rucioIdentity from the token
 * 'UnknownError': If the error is not one of the above
 * @property {string} message - Error message
 */ 
export type SetX509LoginSessionError = {
    type: 'InvalidVO' | 'InvalidToken' | 'UnknownError'
    message: string
}