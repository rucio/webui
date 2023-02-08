/**
 * RequestModel for {@link UserPassLoginInputPort}
 */
export type UserpassLoginRequest = {
    username: string;
    password: string;
    account: string;
    redirectTo?: string;
}

/**
 * ResponseModel for {@link UserPassLoginOutputPort}, if login was successful
 */
export type UserpassLoginResponse = {
    rucioIdentity: string;
    rucioAccount: string;
    rucioAuthType: string;
    rucioAuthToken: string;
}

/**
 * ErrorModel for {@link UserPassLoginOutputPort}, if login was not successful
 */
export type UserpassLoginError = {
    message: string;
}