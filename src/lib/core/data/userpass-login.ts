import UserPassLoginOutputPort from "../port/primary/userpass-login-output-port";

/**
 * RequestModel for {@link UserPassLoginInputPort}
 */
export type UserpassLoginRequest = {
    username: string;
    password: string;
    account: string;
    redirectTo: string;
}

/**
 * ResponseModel for {@link UserPassLoginOutputPort}, if login was successful
 */
export type UserpassLoginResponse = {
    rucioIdentity: string;
    rucioAccount: string;
    rucioAuthToken: string;
    rucioAuthTokenExpires: string;
}

/**
 * ErrorModel for {@link UserPassLoginOutputPort}, if login was not successful
 * @property {string} type - Type of error: 
 * 'AUTH_SERVER_CONFIGURATION_ERROR':If webui's environment file is missing the configuration variable for rucio auth server
 * 'AUTH_SERVER_SIDE_ERROR': If rucio auth server returns an error
 * 'INVALID_CREDENTIALS': If the user entered invalid credentials
 * 'UNKNOWN_ERROR': If the error is not one of the above
 * @property {string} message - Error message
 */
export type UserpassLoginError = {
    type: 'AUTH_SERVER_CONFIGURATION_ERROR' | 'AUTH_SERVER_SIDE_ERROR' | 'INVALID_CREDENTIALS' | 'UNKNOWN_ERROR';
    message: string;
}