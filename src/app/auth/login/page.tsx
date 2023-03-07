'use client';
import { AuthViewModel, x509AuthRequestHeaders as X509AuthRequestHeaders } from "@/lib/infrastructure/data/auth/auth";
import { LoginViewModel } from "@/lib/infrastructure/data/view-model/login";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Login as LoginStory } from "@/component-library/components/Pages/Login/Login";
import { VO } from "@/lib/core/entity/auth-models";


export default function Login() {
    const [redirectURL, setRedirectURL] = useState<string>('/dashboard' as string)
    const [viewModel, setViewModel] = useState<LoginViewModel>()
    const [authViewModel, setAuthViewModel] = useState<AuthViewModel>()
    const router = useRouter()
    const callbackUrl = useSearchParams().get('callbackUrl')

    const handleUserpassSubmit = async (username: string, password: string, vo: VO, account?: string) => {
        const body = {
            username: username,
            password: password
        }
        try {
            const res = await fetch('/api/auth/userpass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
            if (res.status === 200 || res.status === 401) {
                const auth: AuthViewModel = await res.json()
                setAuthViewModel(auth)
                if (auth.status === 'success') {
                    const redirect: string = redirectURL
                    router.push(redirect)
                }
            }
        } catch (error) {
            console.error('An unexpected error happened occurred:', error)
        }
    };

    /**
     * Sends a request directly to the x509 endpoint of rucio auth server to retrieve a RucioAuthTOken using x509 client certificate provided via the browser
     * @param vo 
     * @param account 
     * @returns {@link AuthViewModel} indicating the status of the request
     */
    const handleX509Submit = async (vo: VO, loginViewModel: LoginViewModel, account?: string | undefined): Promise<AuthViewModel> => {
        const rucioAuthHost = loginViewModel.rucioAuthHost
        const rucioX509Endpoint = `${rucioAuthHost}/auth/x509`

        let requestHeaders: X509AuthRequestHeaders = {
            'X-Rucio-Allow-Return-Multiple-Accounts': true,
            'X-Rucio-VO': vo.shortName,
            'X-Rucio-AppID': 'rucio-webui',
        }
        if (account) {
            requestHeaders['X-Rucio-Account'] = account
        }
        const headers: HeadersInit = new Headers()
        Object.entries(requestHeaders).forEach(([key, value]) => {
            headers.append(key, value as string)
        })

        const res = await fetch(rucioX509Endpoint, {
            method: 'GET',
            headers: headers
        })

        let responseBody = {}
        try{
            responseBody = await res.json()
        } catch (error) {
            // do nothing
        }
        
        if (res.status === 200 ) {
            const rucioAuthToken: string | null = res.headers.get('X-Rucio-Auth-Token')
            let auth: AuthViewModel = {
                status: 'error',
                message: 'Cannot retrieve RucioAuthToken from response headers',
                rucioAccount: '',
                rucioAuthType: '',
                rucioIdentity: '',
                rucioAuthToken: ''
            }
            if (rucioAuthToken === null) {
                return Promise.resolve(auth)
            }
            auth.status = 'success'
            auth.message = "Login successful. The session has not been set yet."
            auth.rucioAccount = res.headers.get('X-Rucio-Auth-Account') || account || ''
            auth.rucioAuthType = 'x509'
            auth.rucioAuthToken = rucioAuthToken
            return Promise.resolve(auth)

        } else if (res.status === 206) {
            const auth: AuthViewModel = {
                status: 'multiple_accounts',
                message: res.headers.get('X-Rucio-Auth-Accounts') || '',
                rucioAccount: '',
                rucioAuthType: '',
                rucioIdentity: '',
                rucioAuthToken: ''
            }
            return Promise.resolve(auth)
        } else if (res.status === 401) {
            const auth: AuthViewModel = {
                status: 'error',
                message: `Unauthorized: ${responseBody?.ExceptionMessage}`,
                rucioAccount: '',
                rucioAuthType: '',
                rucioIdentity: '',
                rucioAuthToken: ''
            }
            return Promise.resolve(auth)
        } else {
            const auth: AuthViewModel = {
                status: 'error',
                message: 'error',
                rucioAccount: '',
                rucioAuthType: '',
                rucioIdentity: '',
                rucioAuthToken: ''
            }
            return Promise.resolve(auth)
        }
    };
   
    /**
     * Sets the session after a x509 login
     * @param auth details of the x509 login
     */
    const handleX509Session = async (auth: AuthViewModel) => {
        if (auth.status !== 'success') {
            auth.message = 'Cannot set session for x509 login as the login was not successful'
            setAuthViewModel(auth)
            return
        }
        const res = await fetch('/api/auth/x509', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(auth)
        })
        
        if (res.status === 200) {
            // redirect to callback url
            router.push(redirectURL)
            return Promise.resolve()
        }
        else {
            setAuthViewModel(auth)
        }
    }

    
    useEffect(() => {
        if (callbackUrl) {
            const redirectURL = decodeURIComponent(callbackUrl)
            setRedirectURL(redirectURL)
        }

        fetch('/api/auth/login', {
            method: 'POST',
        })
            .then((res) => res.json())
            .then((loginViewModel: LoginViewModel) => {
                setViewModel(loginViewModel)
                if (loginViewModel.isLoggedIn) {
                    router.push(redirectURL)
                }
            }
            )
    }, []);

    if (viewModel === undefined) {
        // the hook has not yet run
        return <p>Loading...</p>
    }
    else {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoginStory
                    loginViewModel={viewModel}
                    authViewModel={authViewModel}
                    userPassSubmitHandler={handleUserpassSubmit}
                    oidcSubmitHandler={() => { }}
                    x509SubmitHandler={handleX509Submit}
                    x509SessionHandler={handleX509Session}
                />
            </div>
        );
    }
}