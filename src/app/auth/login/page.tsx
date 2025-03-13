'use client';
import { AuthViewModel, x509AuthRequestHeaders as X509AuthRequestHeaders } from '@/lib/infrastructure/data/auth/auth';
import { LoginViewModel } from '@/lib/infrastructure/data/view-model/login';
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Login as LoginStory } from '@/component-library/pages/legacy/Login/Login';
import { AuthType, Role, VO } from '@/lib/core/entity/auth-models';

export default function Login() {
    useEffect(() => {
        document.title = 'Login - Rucio';
    }, []);

    const [redirectURL, setRedirectURL] = useState<string>('/dashboard');
    const [viewModel, setViewModel] = useState<LoginViewModel>();
    const [authViewModel, setAuthViewModel] = useState<AuthViewModel>();
    const router = useRouter();

    return (
        <Suspense fallback={<p>Loading...</p>}>
            <LoginContent
                redirectURL={redirectURL}
                setRedirectURL={setRedirectURL}
                viewModel={viewModel}
                setViewModel={setViewModel}
                authViewModel={authViewModel}
                setAuthViewModel={setAuthViewModel}
                router={router}
            />
        </Suspense>
    );
}

function LoginContent({
    redirectURL,
    setRedirectURL,
    viewModel,
    setViewModel,
    authViewModel,
    setAuthViewModel,
    router,
}: {
    redirectURL: string;
    setRedirectURL: (url: string) => void;
    viewModel?: LoginViewModel;
    setViewModel: (vm: LoginViewModel) => void;
    authViewModel?: AuthViewModel;
    setAuthViewModel: (vm: AuthViewModel) => void;
    router: ReturnType<typeof useRouter>;
}) {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get('callbackUrl');

    useEffect(() => {
        if (callbackUrl) {
            setRedirectURL(decodeURIComponent(callbackUrl));
        }

        if (!viewModel) {
            fetch('/api/auth/login', {
                method: 'POST',
            })
                .then(res => res.json())
                .then((loginViewModel: LoginViewModel) => {
                    setViewModel(loginViewModel);
                })
                .catch(error => console.error('Error fetching login data:', error));
        }
    }, [callbackUrl, viewModel]);

    const handleUserpassSubmit = async (username: string, password: string, vo: VO, account?: string) => {
        const body = {
            username,
            password,
            account,
            vo: vo.shortName,
        };
        try {
            const res = await fetch('/api/auth/userpass', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.status === 200 || res.status === 401 || res.status === 206) {
                const auth: AuthViewModel = await res.json();
                setAuthViewModel(auth);
                if (auth.status === 'success') {
                    router.push(redirectURL);
                }
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        }
    };

    const getMultipleAccountsViewModel = (res: Response): AuthViewModel => {
        const multipleAccounts = res.headers.get('X-Rucio-Auth-Accounts');
        return multipleAccounts
            ? ({ status: 'multiple_accounts', message: multipleAccounts, role: Role.USER } as AuthViewModel)
            : ({ status: 'error', message: 'Cannot retrieve X-Rucio-Auth-Accounts', role: Role.USER } as AuthViewModel);
    };

    const handleX509Submit = async (vo: VO, loginViewModel: LoginViewModel, account?: string): Promise<AuthViewModel> => {
        const rucioAuthHost = loginViewModel.rucioAuthHost;
        const rucioX509Endpoint = `${rucioAuthHost}/auth/x509/webui`;

        let requestHeaders: X509AuthRequestHeaders = {
            'X-Rucio-Allow-Return-Multiple-Accounts': true,
            'X-Rucio-VO': vo.shortName,
            'X-Rucio-AppID': 'rucio-webui',
        };
        if (account) requestHeaders['X-Rucio-Account'] = account;

        try {
            const res = await fetch(rucioX509Endpoint, {
                method: 'GET',
                headers: new Headers(Object.entries(requestHeaders).map(([key, value]) => [key, value as string])),
                credentials: 'include',
            });

            if (res.status === 200) {
                const authToken = res.headers.get('X-Rucio-Auth-Token');
                const authTokenExpires = res.headers.get('X-Rucio-Auth-Token-Expires');
                const authAccount = res.headers.get('X-Rucio-Auth-Account');
                if (!authToken || !authTokenExpires || !authAccount) {
                    return { status: 'error', message: 'Missing authentication headers', role: Role.USER } as AuthViewModel;
                }
                return {
                    status: 'success',
                    message: 'Login successful',
                    rucioAccount: authAccount,
                    rucioAuthType: AuthType.x509,
                    rucioAuthToken: authToken,
                    rucioAuthTokenExpires: authTokenExpires,
                    role: Role.USER,
                } as AuthViewModel;
            } else if (res.status === 206) {
                return getMultipleAccountsViewModel(res);
            } else if (res.status === 401) {
                return { status: 'error', message: 'Unauthorized', role: Role.USER } as AuthViewModel;
            } else {
                return { status: 'error', message: 'Unknown error', role: Role.USER } as AuthViewModel;
            }
        } catch (error) {
            return { status: 'error', message: `X509 login error: ${(error as Error).message}`, role: Role.USER } as AuthViewModel;
        }
    };

    const handleX509Session = async (auth: AuthViewModel, rucioAccount: string, shortVOName: string) => {
        if (auth.status !== 'success') {
            setAuthViewModel(auth);
            return;
        }
        try {
            const res = await fetch('/api/auth/x509', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rucioAccount,
                    rucioAuthToken: auth.rucioAuthToken,
                    rucioTokenExpiry: auth.rucioAuthTokenExpires,
                    shortVOName,
                }),
            });

            if (res.status === 200) {
                router.push(redirectURL);
            } else {
                setAuthViewModel(await res.json());
            }
        } catch (error) {
            console.error('Error setting session:', error);
        }
    };

    if (!viewModel) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <LoginStory
                loginViewModel={viewModel}
                authViewModel={authViewModel}
                userPassSubmitHandler={handleUserpassSubmit}
                oidcSubmitHandler={() => {}}
                x509SubmitHandler={handleX509Submit}
                x509SessionHandler={handleX509Session}
            />
        </div>
    );
}
