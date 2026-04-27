/**
 * Represents the auth type in Rucio. If the auth type is x509, the user is authenticated via x509 certificates.
 * If the auth type is userpass, the user is authenticated via username and password.
 * If the auth type is oidc, the user is authenticated via OpenID Connect.
 */
export enum AuthType {
    x509 = 'x509',
    USERPASS = 'userpass',
    OIDC = 'oidc',
}

/**
 * Represents the role of a user in Rucio. If the user has an account attribute 'admin' set to True, the user is an admin.
 * Otherwise, the user is a regular user.
 * @property ADMIN - Admin user
 * @property USER - Regular user
 */
export enum Role {
    ADMIN = 'admin',
    USER = 'user',
}
/**
 * Representing information about the user that is safe to be shared with the frontend app
 */
export type User = {
    rucioIdentity: string;
    rucioAccount: string;
    rucioVO: string;
    role: Role;
    country?: string;
    countryRole?: Role;
    /**
     * The auth method that produced the live Rucio token for this account.
     * Surfaced so the AccountDropdown can label switch entries (userpass /
     * x509 / oidc) and give them stable per-method keys (#628). Optional
     * because legacy callers of GetSiteHeader did not need it.
     */
    rucioAuthType?: AuthType | null;
};

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
    rucioAuthToken: string;
    rucioAuthTokenExpires: string;
    rucioAuthType: AuthType | null;
    rucioOIDCProvider: string | null;
    isLoggedIn: boolean;
    /**
     * All accounts the Rucio identity is mapped to (including this one). Set
     * when the underlying auth flow can enumerate them — currently only
     * userpass via /api/auth/userpass/probe (#628). The AccountDropdown uses
     * this to surface "switch to X (re-auth required)" entries for accounts
     * not currently in session.allUsers[].
     */
    identityAccounts?: string[];
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
    issuer?: string;
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
};

export const DefaultVO: VO = {
    name: 'Default',
    shortName: 'def',
    logoUrl: '',
    oidcEnabled: false,
    oidcProviders: [],
};
