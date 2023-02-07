
export type UserpassLoginRequest = {
    username: string;
    password: string;
    account: string;
    redirectTo?: string;
}

export type UserpassLoginResponse = {
    rucioIdentity: string;
    rucioAccount: string;
    rucioAuthType: string;
    rucioAuthToken: string;
}

export type UserpassLoginError = {
    message: string;
}