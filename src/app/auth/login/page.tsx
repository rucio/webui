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

        const responseBody = await res.json()
        console.log('responseBody', responseBody)
        console.log('res.status', res.status)
        
        if (res.status === 200) {
            console.log(responseBody)
        } else {
            const auth: AuthViewModel = {
                status: 'error',
                message: 'error',
                rucioAccount: '',
                rucioAuthType: '',
                rucioIdentity: '',
                rucioAuthToken: ''
            }
            setAuthViewModel(auth)
        }
        return new Promise((resolve, reject) => {
            resolve({
                status: 'success',
                message: 'success',
                rucioAccount: 'root',
                rucioAuthType: 'x509',
                rucioIdentity: 'C=DE,O=GermanGrid,OU=DESY,CN=DESY User',
                rucioAuthToken: 'asd'
            })
        })
    };

    /**
     * Sets the session of the x509 login
     * @param authViewModel details of the x509 login
     */
    const handleX509Session = (authViewModel: AuthViewModel) => {
        setAuthViewModel(authViewModel)
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

    if(viewModel === undefined) {
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