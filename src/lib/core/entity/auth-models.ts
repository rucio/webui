export type RucioUser = {
    rucioAuthToken: string
    rucioAccount: string
    rucioIdentity: string
    rucioAuthType: 'x509' | 'userpass' | 'oidc'
    rucioOIDCProvider: string
    isLoggedIn: boolean
}