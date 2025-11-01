'use client';
import { AuthViewModel, x509AuthRequestHeaders as X509AuthRequestHeaders } from '@/lib/infrastructure/data/auth/auth';
import { LoginViewModel } from '@/lib/infrastructure/data/view-model/login';
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Login as LoginStory } from '@/component-library/pages/legacy/Login/Login';
import { AuthType, OIDCProvider, Role, VO } from '@/lib/core/entity/auth-models';
import { signIn, useSession } from 'next-auth/react';
import { AUTH_ERROR_MESSAGES, LoginError } from '@/lib/core/entity/auth-errors';
import { LoadingPage } from '@/component-library/pages/system/LoadingPage';

function LoginContent() {
    useEffect(() => {
        document.title = 'Login - Rucio';
    }, []);

    const [redirectURL, setRedirectURL] = useState<string>('/dashboard' as string);
    const [viewModel, setViewModel] = useState<LoginViewModel>();
    const [authViewModel, setAuthViewModel] = useState<AuthViewModel>();
    const router = useRouter();
    const callbackUrl = (useSearchParams() as ReadonlyURLSearchParams).get('callbackUrl');
    const { data: session } = useSession();

    // Check for OIDC errors after redirect from OIDC provider
    useEffect(() => {
        if (session && (session as any).oidcError) {
            console.error('[Login] OIDC error detected:', (session as any).oidcError);
            setAuthViewModel({
                status: 'error',
                message: (session as any).oidcError,
                rucioAccount: '',
                rucioAuthType: AuthType.OIDC,
                rucioIdentity: (session as any).oidcIdentity || '',
                rucioAuthToken: '',
                rucioAuthTokenExpires: '',
                role: Role.USER,
            });
        }
    }, [session]);

    const handleUserpassSubmit = async (username: string, password: string, vo: VO, account?: string) => {
        console.log('[LOGIN FLOW 1] handleUserpassSubmit called', {
            username,
            vo: vo.shortName,
            account: account || '(none)',
            redirectURL,
            timestamp: new Date().toISOString()
        });

        try {
            const result = await signIn('userpass', {
                username: username,
                password: password,
                account: account || '',
                vo: vo.shortName,
                redirect: false,
            });

            console.log('[LOGIN FLOW 2] signIn result received', {
                ok: result?.ok,
                error: result?.error,
                status: result?.status,
                url: result?.url
            });

            // Check for error first, as NextAuth can return ok: true with an error
            if (result?.error) {
                console.log('[LOGIN FLOW 4] Login failed with error', {
                    error: result.error,
                    errorType: result.error === 'CredentialsSignin' ? 'CredentialsSignin' : 'Other'
                });

                // NextAuth wraps errors from the authorize function as CredentialsSignin
                // We need to extract the original error message if available
                let errorMessage = 'Login failed. Please try again.';

                if (result.error === 'CredentialsSignin') {
                    // Default to invalid credentials message
                    errorMessage = AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
                } else {
                    // Use the error as-is for other error types
                    errorMessage = result.error;
                }

                setAuthViewModel({
                    status: 'error',
                    message: errorMessage,
                    rucioAccount: '',
                    rucioAuthType: '',
                    rucioIdentity: '',
                    rucioAuthToken: '',
                    rucioAuthTokenExpires: '',
                    role: Role.USER,
                });
            } else if (result?.ok) {
                console.log('[LOGIN FLOW 3] Login successful, redirecting to:', redirectURL);
                // Login successful, redirect to dashboard
                router.push(redirectURL);
            }
        } catch (error: any) {
            console.error('An unexpected error occurred:', error);

            // Check if it's a LoginError with specific error details
            if (error instanceof LoginError || error?.name === 'LoginError') {
                setAuthViewModel({
                    status: 'error',
                    message: error.message || AUTH_ERROR_MESSAGES.UNKNOWN_ERROR,
                    rucioAccount: '',
                    rucioAuthType: '',
                    rucioIdentity: '',
                    rucioAuthToken: '',
                    rucioAuthTokenExpires: '',
                    role: Role.USER,
                });
                return;
            }

            // Check if it's a MultipleAccountsError
            if (error?.name === 'MultipleAccountsError') {
                // Extract available accounts if present
                const availableAccounts = error?.availableAccounts;
                if (availableAccounts) {
                    // Show the multiple accounts status with the account list
                    setAuthViewModel({
                        status: 'multiple_accounts',
                        message: availableAccounts,
                        rucioAccount: '',
                        rucioAuthType: '',
                        rucioIdentity: '',
                        rucioAuthToken: '',
                        rucioAuthTokenExpires: '',
                        role: Role.USER,
                    });
                    return;
                }
            }

            // Generic error fallback
            setAuthViewModel({
                status: 'error',
                message: AUTH_ERROR_MESSAGES.UNKNOWN_ERROR,
                rucioAccount: '',
                rucioAuthType: '',
                rucioIdentity: '',
                rucioAuthToken: '',
                rucioAuthTokenExpires: '',
                role: Role.USER,
            });
        }
    };

    const getMultipleAccountsViewModel = (res: Response): AuthViewModel => {
        const multiple_accounts = res.headers.get('X-Rucio-Auth-Accounts');
        if (multiple_accounts === null) {
            return {
                status: 'error',
                message: 'Cannot retrieve X-Rucio-Auth-Accounts from response headers',
                rucioAccount: '',
                rucioAuthType: '',
                rucioIdentity: '',
                rucioAuthToken: '',
                rucioAuthTokenExpires: '',
                role: Role.USER,
            };
        }
        return {
            status: 'multiple_accounts',
            message: multiple_accounts,
            rucioAccount: '',
            rucioAuthType: '',
            rucioIdentity: '',
            rucioAuthToken: '',
            rucioAuthTokenExpires: '',
            role: Role.USER,
        };
    };

    /**
     * Sends a request directly to the x509 endpoint of rucio auth server to retrieve a RucioAuthTOken using x509 client certificate provided via the browser
     * @param vo
     * @param account
     * @returns {@link AuthViewModel} indicating the status of the request
     */
    const handleX509Submit = async (vo: VO, loginViewModel: LoginViewModel, account?: string | undefined): Promise<AuthViewModel> => {
        const rucioAuthHost = loginViewModel.rucioAuthHost;
        const rucioX509Endpoint = `${rucioAuthHost}/auth/x509/webui`;

        const requestHeaders: X509AuthRequestHeaders = {
            'X-Rucio-Allow-Return-Multiple-Accounts': true,
            'X-Rucio-VO': vo.shortName,
            'X-Rucio-AppID': 'rucio-webui',
        };
        if (account) {
            requestHeaders['X-Rucio-Account'] = account;
        }
        const headers: HeadersInit = new Headers();
        Object.entries(requestHeaders).forEach(([key, value]) => {
            headers.append(key, value as string);
        });

        let res: Response;
        try {
            res = await fetch(rucioX509Endpoint, {
                method: 'GET',
                headers: headers,
                credentials: 'include',
            });
        } catch (error) {
            console.log(error);
            return Promise.resolve({
                status: 'error',
                message: 'An error occurred while trying to login with x509 certificate: ' + (error as Error).message,
                rucioAccount: '',
                rucioAuthType: '',
                rucioIdentity: '',
                rucioAuthToken: '',
                rucioAuthTokenExpires: '',
                role: Role.USER,
            });
        }

        let responseBody: {
            ExceptionMessage?: string;
            ExceptionClass?: string;
        } = {};
        try {
            responseBody = await res.json();
        } catch (error) {
            // do nothing
        }

        if (res.status === 200) {
            const rucioAuthToken: string | null = res.headers.get('X-Rucio-Auth-Token');
            const rucioAuthTokenExpires: string | null = res.headers.get('X-Rucio-Auth-Token-Expires');
            const rucioAccount: string | null = res.headers.get('X-Rucio-Auth-Account');
            const auth: AuthViewModel = {
                status: 'error',
                message: '',
                rucioAccount: '',
                rucioAuthType: '',
                rucioIdentity: '',
                rucioAuthToken: '',
                rucioAuthTokenExpires: '',
                role: Role.USER,
            };
            if (rucioAuthToken === null) {
                auth.message = 'Cannot retrieve X-Rucio-Auth-Token from response headers';
                return Promise.resolve(auth);
            }
            if (rucioAuthTokenExpires === null) {
                auth.message = 'Cannot retrieve X-Rucio-Auth-Token-Expires from response headers';
                return Promise.resolve(auth);
            }
            if (rucioAccount === null) {
                auth.message = 'Cannot retrieve X-Rucio-Account from response headers';
                return Promise.resolve(auth);
            }
            auth.status = 'success';
            auth.message = 'Login successful. The session has not been set yet.';
            auth.rucioAccount = rucioAccount;
            auth.rucioAuthType = AuthType.x509;
            auth.rucioAuthToken = rucioAuthToken;
            auth.rucioAuthTokenExpires = rucioAuthTokenExpires;
            return Promise.resolve(auth);
        } else if (res.status === 206) {
            const viewModel = getMultipleAccountsViewModel(res);
            return Promise.resolve(viewModel);
        } else if (res.status === 401) {
            const auth: AuthViewModel = {
                status: 'error',
                message: `Unauthorized: ${responseBody?.ExceptionMessage}`,
                rucioAccount: '',
                rucioAuthType: '',
                rucioIdentity: '',
                rucioAuthToken: '',
                rucioAuthTokenExpires: '',
                role: Role.USER,
            };
            return Promise.resolve(auth);
        } else {
            const auth: AuthViewModel = {
                status: 'error',
                message: 'unknown error',
                rucioAccount: '',
                rucioAuthType: '',
                rucioIdentity: '',
                rucioAuthToken: '',
                rucioAuthTokenExpires: '',
                role: Role.USER,
            };
            return Promise.resolve(auth);
        }
    };

    /**
     * Sets the session after a x509 login
     * @param {AuthViewModel} auth details of the x509 login containing the rucioAuthToken, rucioTokenExpiry or the error.
     * The rest of the parameters should to be provided by this function
     */
    const handleX509Session = async (auth: AuthViewModel, rucioAccount: string, shortVOName: string) => {
        if (auth.status !== 'success') {
            setAuthViewModel(auth);
            return;
        }

        try {
            const result = await signIn('x509', {
                rucioAuthToken: auth.rucioAuthToken,
                rucioAccount: rucioAccount,
                shortVOName: shortVOName,
                rucioTokenExpiry: auth.rucioAuthTokenExpires,
                redirect: false,
            });

            if (result?.ok) {
                // Login successful, redirect to callback url
                router.push(redirectURL);
            } else if (result?.error) {
                // Login failed, show error
                setAuthViewModel({
                    status: 'error',
                    message: result.error,
                    rucioAccount: '',
                    rucioAuthType: '',
                    rucioIdentity: '',
                    rucioAuthToken: '',
                    rucioAuthTokenExpires: '',
                    role: Role.USER,
                });
            }
        } catch (error) {
            console.error('An unexpected error occurred during x509 session setup:', error);
            setAuthViewModel({
                status: 'error',
                message: 'An unexpected error occurred during login',
                rucioAccount: '',
                rucioAuthType: '',
                rucioIdentity: '',
                rucioAuthToken: '',
                rucioAuthTokenExpires: '',
                role: Role.USER,
            });
        }
    };

    /**
     * Handle OIDC provider authentication (Dynamic - works with any provider)
     *
     * For OAuth/OIDC providers, NextAuth must handle the redirect to perform the OAuth flow.
     * Unlike Credentials providers (userpass, x509), we cannot use redirect: false here.
     */
    const handleOIDCSubmit = async (provider: OIDCProvider, vo: VO, account?: string) => {
        try {
            console.log(`[Login] Starting OIDC authentication with provider: ${provider.name}`);

            // Build callback URL with VO and account parameters
            // After successful OIDC authentication, user will be redirected here
            const params = new URLSearchParams({
                vo: vo.shortName,
            });
            if (account) {
                params.set('account', account);
            }
            const callbackUrlWithParams = `${redirectURL}?${params.toString()}`;

            console.log(`[Login] Callback URL: ${callbackUrlWithParams}`);
            console.log(`[Login] Redirecting to ${provider.name} SSO for authentication...`);

            await signIn(provider.name.toLowerCase(), {
                callbackUrl: callbackUrlWithParams,
                // Note: redirect defaults to true for OAuth providers
                // The browser will redirect before this function returns
            });
        } catch (error: any) {
            console.error(`[Login] OIDC login error with ${provider.name}:`, error);
            setAuthViewModel({
                status: 'error',
                message: `An unexpected error occurred during OIDC login: ${error.message || 'Unknown error'}`,
                rucioAccount: '',
                rucioAuthType: AuthType.OIDC,
                rucioIdentity: '',
                rucioAuthToken: '',
                rucioAuthTokenExpires: '',
                role: Role.USER,
            });
        }
    };

    useEffect(() => {
        if (callbackUrl) {
            const redirectURL = decodeURIComponent(callbackUrl);
            setRedirectURL(redirectURL);
        }

        fetch('/api/auth/login', {
            method: 'POST',
        })
            .then(res => res.json())
            .then((loginViewModel: LoginViewModel) => {
                setViewModel(loginViewModel);
            });
    }, []);

    if (viewModel === undefined) {
        // the hook has not yet run
        return <LoadingPage message="Loading login..." />;
    } else {
        return (
            <LoginStory
                loginViewModel={viewModel}
                authViewModel={authViewModel}
                userPassSubmitHandler={handleUserpassSubmit}
                oidcSubmitHandler={handleOIDCSubmit}
                x509SubmitHandler={handleX509Submit}
                x509SessionHandler={handleX509Session}
            />
        );
    }
}

export default function Login() {
    return (
        <Suspense fallback={<LoadingPage message="Loading login..." />}>
            <LoginContent />
        </Suspense>
    );
}
