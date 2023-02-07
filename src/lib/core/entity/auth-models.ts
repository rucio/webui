/**
 * Rucio User Model obtained after a successful login via any of the supported auth methods
 */
export type RucioUser = {
    rucioAuthToken: string
    rucioAccount: string
    rucioIdentity: string
    rucioAuthType: 'x509' | 'userpass' | 'oidc'
    rucioOIDCProvider: string
    isLoggedIn: boolean
}