import { OIDCProvider } from "@/lib/core/entity/auth-models"

export const getSampleOIDCProviders = (): OIDCProvider[] => {
    const oidcProviders: OIDCProvider[] = []
    const cern: OIDCProvider = {
        name: 'cern',
        url: 'https://cern.ch',
        iconUrl: 'https://cern.ch/icon.png',
        clientId: 'client-id',
        clientSecret: 'client-secret',
        scopes: ['scope1', 'scope2'],
        authorizationUrl: 'https://cern.ch/auth',
        tokenUrl: 'https://cern.ch/token',
        redirectUrl: 'https://cern.ch/redirect',
    }
    const testProvider: OIDCProvider = {
        name: 'test-provider',
        url: 'https://test-provider.ch',
        iconUrl: 'https://test-provider.ch/icon.png',
        clientId: 'client-id',
        clientSecret: 'client-secret',
        scopes: ['scope1', 'scope2'],
        authorizationUrl: 'https://test-provider.ch/auth',
        tokenUrl: 'https://test-provider.ch/token',
        redirectUrl: 'https://test-provider.ch/redirect',
    }
    oidcProviders.push(cern)
    oidcProviders.push(testProvider)
    return oidcProviders
}

export const createOIDCProviders = () => {
    process.env['OIDC_ENABLED'] = 'true'
    process.env['OIDC_PROVIDERS'] = 'cern, test-provider'
    process.env['OIDC_PROVIDER_CERN_URL'] = 'https://cern.ch'
    process.env['OIDC_PROVIDER_CERN_ICON_URL'] = 'https://cern.ch/icon.png'
    process.env['OIDC_PROVIDER_CERN_CLIENT_ID'] = 'client-id'
    process.env['OIDC_PROVIDER_CERN_CLIENT_SECRET'] = 'client-secret'
    process.env['OIDC_PROVIDER_CERN_SCOPES'] = 'scope1,scope2'
    process.env['OIDC_PROVIDER_CERN_AUTHORIZATION_URL'] = 'https://cern.ch/auth'
    process.env['OIDC_PROVIDER_CERN_TOKEN_URL'] = 'https://cern.ch/token'
    process.env['OIDC_PROVIDER_CERN_USERINFO_URL'] = 'https://cern.ch/userinfo'
    process.env['OIDC_PROVIDER_CERN_REDIRECT_URL'] = 'https://cern.ch/redirect'
    process.env['OIDC_PROVIDER_CERN_REFRESH_TOKEN_URL'] =
        'https://cern.ch/userinfo'
    process.env['OIDC_PROVIDER_CERN_LOGOUT_URL'] = 'https://cern.ch/logout'

    process.env['OIDC_PROVIDER_TEST-PROVIDER_URL'] = 'https://test-provider.ch'
    process.env['OIDC_PROVIDER_TEST-PROVIDER_ICON_URL'] =
        'https://test-provider.ch/icon.png'
    process.env['OIDC_PROVIDER_TEST-PROVIDER_CLIENT_ID'] = 'client-id'
    process.env['OIDC_PROVIDER_TEST-PROVIDER_CLIENT_SECRET'] = 'client-secret'
    process.env['OIDC_PROVIDER_TEST-PROVIDER_SCOPES'] = 'scope1,scope2'
    process.env['OIDC_PROVIDER_TEST-PROVIDER_AUTHORIZATION_URL'] =
        'https://test-provider.ch/auth'
    process.env['OIDC_PROVIDER_TEST-PROVIDER_TOKEN_URL'] =
        'https://test-provider.ch/token'
    process.env['OIDC_PROVIDER_TEST-PROVIDER_USERINFO_URL'] =
        'https://test-provider.ch/userinfo'
    process.env['OIDC_PROVIDER_TEST-PROVIDER_REDIRECT_URL'] =
        'https://test-provider.ch/redirect'
    process.env['OIDC_PROVIDER_TEST-PROVIDER_REFRESH_TOKEN_URL'] =
        'https://test-provider.ch/userinfo'
    process.env['OIDC_PROVIDER_TEST-PROVIDER_LOGOUT_URL'] =
        'https://test-provider.ch/logout'
}

export const deleteOIDCProviders = () => {
    delete process.env['OIDC_ENABLED']
    delete process.env['OIDC_PROVIDERS']
    delete process.env['OIDC_PROVIDER_CERN_URL']
    delete process.env['OIDC_PROVIDER_CERN_ICON_URL']
    delete process.env['OIDC_PROVIDER_CERN_CLIENT_ID']
    delete process.env['OIDC_PROVIDER_CERN_CLIENT_SECRET']
    delete process.env['OIDC_PROVIDER_CERN_SCOPES']
    delete process.env['OIDC_PROVIDER_CERN_AUTHORIZATION_URL']
    delete process.env['OIDC_PROVIDER_CERN_TOKEN_URL']
    delete process.env['OIDC_PROVIDER_CERN_USERINFO_URL']
    delete process.env['OIDC_PROVIDER_CERN_REDIRECT_URL']
    delete process.env['OIDC_PROVIDER_CERN_REFRESH_TOKEN_URL']
    delete process.env['OIDC_PROVIDER_CERN_LOGOUT_URL']

    delete process.env['OIDC_PROVIDER_TEST-PROVIDER_URL']
    delete process.env['OIDC_PROVIDER_TEST-PROVIDER_ICON_URL']
    delete process.env['OIDC_PROVIDER_TEST-PROVIDER_CLIENT_ID']
    delete process.env['OIDC_PROVIDER_TEST-PROVIDER_CLIENT_SECRET']
    delete process.env['OIDC_PROVIDER_TEST-PROVIDER_SCOPES']
    delete process.env['OIDC_PROVIDER_TEST-PROVIDER_AUTHORIZATION_URL']
    delete process.env['OIDC_PROVIDER_TEST-PROVIDER_TOKEN_URL']
    delete process.env['OIDC_PROVIDER_TEST-PROVIDER_USERINFO_URL']
    delete process.env['OIDC_PROVIDER_TEST-PROVIDER_REDIRECT_URL']
    delete process.env['OIDC_PROVIDER_TEST-PROVIDER_REFRESH_TOKEN_URL']
    delete process.env['OIDC_PROVIDER_TEST-PROVIDER_LOGOUT_URL']

}