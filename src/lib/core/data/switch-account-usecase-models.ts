/**
 * Switch Account Use Case Models
 * @property {string} rucioIdentity - Rucio Identity
 * @property {string} rucioAccount - Rucio Account
 * @property {string} rucioAuthType - Rucio Auth Type i.e. userpass, x509, oidc
 * @property {string} redirectTo - Redirect URL
 */
export interface SwitchAccountRequest {
    rucioIdentity: string,
    rucioAccount: string,
    rucioAuthType: 'userpass' | 'x509' | 'oidc',
    redirectTo?: string
}


export interface SwitchAccountResponse{
    redirectTo: string
}

/**
 * Error Model for {@link SwitchAccountOutputPort}
 * @property {string} type - Type of error:
 * 'invalid_auth_type': If the auth type is invalid i.e. not one of userpass, x509, oidc
 * 'bad request': If the request is invalid i.e. missing required fields
 * 'cannot_switch_account': If the account switching process failed
 */
export interface SwitchAccountError {
    message: string
    type: 'invalid_auth_type' | 'bad request' | 'cannot_switch_account'
}
