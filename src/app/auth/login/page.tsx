'use client';
import { AuthViewModel } from "@/lib/infrastructure/data/auth/auth";
import { LoginViewModel } from "@/lib/infrastructure/data/view-model/login";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Login as LoginStory, LoginPageProps, LoginPageResponse, ShowLoginType} from "@/component-library/components/Pages/Login/Login";


export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirectURL, setRedirectURL] = useState<string>('/dashboard' as string)
    const [viewModel, setViewModel] = useState<LoginViewModel>()
    const router = useRouter()
    const callbackUrl = useSearchParams().get('callbackUrl')

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

    const handleuserpassSubmit = async (username: string, password: string) => {
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
            })//.then((res) => res.json())
            if (res.status === 200) {
                const auth: AuthViewModel = await res.json()
                if (auth.status === 'success') {
                    const redirect: string = redirectURL
                    router.push(redirect)
                }
            }
        } catch (error) {
            console.error('An unexpected error happened occurred:', error)
        }

        console.log(`Username: ${username}`);
    };



    const handleSubmit = (
        response: LoginPageResponse
    ) => {
        console.log(`Username: ${response.username}, Password: ${response.password}, VO: ${response.vo}, Login Type: ${response.loginType}`);
        switch(response.loginType){
            case "userpass":
                handleuserpassSubmit(response.username, response.password)
                break;
            case "x509":
                console.log("x509 login not yet implemented")
                break;
        }
    }

    if(viewModel === undefined) {
        // the hook has not yet run
        return <p>Loading login page</p>
    }
    else {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoginStory
                    loginViewModel={viewModel}
                    login={handleSubmit}
                />
            </div>
        );
    }
}