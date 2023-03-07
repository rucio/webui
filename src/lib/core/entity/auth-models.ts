/**
 * Rucio User Model obtained after a successful login via any of the supported auth methods
 * This model is stored in the session cookie
 */
export type SessionUser = {
    rucioAuthToken: string
    rucioAuthTokenExpires: string
    rucioAccount: string
    rucioIdentity: string
    rucioAuthType: 'x509' | 'userpass' | 'oidc' | null
    rucioOIDCProvider: string | null
    isLoggedIn: boolean
}

/**
 * Represents an OIDC provider in Rucio. Used by auth models when OIDC is enabled.
 */
export type OIDCProvider = {
    name: string;
    url?: string | null;
    iconUrl?: string | null;
    clientId: string;
    clientSecret: string;
    authorizationUrl: string;
    refreshTokenUrl?: string;
    redirectUrl: string;
    tokenUrl: string;
    userInfoUrl?: string;
    scopes?: string[];
};

/**
 * Represents a VO in Rucio. Used by auth models when multi-VO is enabled.
 */
export type VO = {
    name: string;
    shortName: string;
    logoUrl: string;
    oidcEnabled: boolean;
    oidcProviders: OIDCProvider[];
}
