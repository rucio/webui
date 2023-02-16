export type LoginViewModel = {
    x509Enabled: boolean;
    oidcEnabled: boolean;
    oidcProviders: OIDCProvider[];
    multiVOEnabled: boolean;
    voList: string[];
    isLoggedIn: boolean;
}