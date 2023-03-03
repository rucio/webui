'use client';
import { AuthViewModel } from "@/lib/infrastructure/data/auth/auth";
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
                }else {
                    console.log('error', auth)
                }
            }
        } catch (error) {
            console.error('An unexpected error happened occurred:', error)
        }
    };



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
                console.log('loginViewModel', loginViewModel)
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
                    x509SubmitHandler={() => { }}
                />
            </div>
        );
    }
}