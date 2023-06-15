/**
 * Represents the auth type in Rucio. If the auth type is x509, the user is authenticated via x509 certificates.
 * If the auth type is userpass, the user is authenticated via username and password.
 * If the auth type is oidc, the user is authenticated via OpenID Connect.
 */
export enum AuthType {
    x509 = "x509",
    USERPASS = "userpass",
    OIDC = "oidc",
}

/**
 * Represents the role of a user in Rucio. If the user has an account attribute 'admin' set to True, the user is an admin.
 * Otherwise, the user is a regular user.
 * @property ADMIN - Admin user
 * @property USER - Regular user
 */
export enum Role {
    ADMIN = "admin",
    USER = "user",
}
/**
 * Representing information about the user that is safe to be shared with the frontend app
 */
export type User = {
    rucioIdentity: string
    rucioAccount: string
    rucioVO: string
    role: Role
    country?: string
    countryRole?: Role
}

/**
 * Rucio User Model obtained after a successful login via any of the supported auth methods
 * This model is stored in the session cookie
 * @property rucioAuthToken - The Rucio auth token
 * @property rucioAuthTokenExpires - The Rucio auth token expiration timestamp
 * @property rucioAccount - The Rucio account
 * @property rucioIdentity - The Rucio identity
 * @property rucioAuthType - The Rucio auth type
 * @property rucioOIDCProvider - The Rucio OIDC provider
 * @property rucioVO - The Rucio VO (short name)
 */
export interface SessionUser extends User {
    rucioAuthToken: string
    rucioAuthTokenExpires: string
    rucioAuthType: AuthType | null
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

export const DefaultVO: VO = {
    name: 'Default',
    shortName: 'def',
    logoUrl: '',
    oidcEnabled: false,
    oidcProviders: [],
}
