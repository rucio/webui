'use client';
import { AuthViewModel } from "@/lib/infrastructure/data/auth/auth";
import { LoginViewModel } from "@/lib/infrastructure/data/view-model/login";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Login as LoginStory } from "@/component-library/components/Pages/Login/Login";


export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirectURL, setRedirectURL] = useState<string>('/dashboard' as string)
    const [viewModel, setViewModel] = useState({})
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

    const handleUpassSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const body = {
            username: event.currentTarget.username.value,
            password: event.currentTarget.password.value,
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

    return (
        <div className="flex items-center justify-center h-screen">
            <LoginStory
                loginViewModel={
                    // viewModel
                    {
                        x509Enabled: true,
                        oidcEnabled: true,
                        oidcProviders: ["OIDC Provider 1", "OIDC Provider 2", "OIDC Provider 3"],
                        multiVOEnabled: true,
                        voList: ["VO 1", "VO 2", "VO 3"],
                        isLoggedIn: false,
                    } as LoginViewModel
                }
                login={() => {console.log("upass login")}}
            />
        </div>
        // <div>
        //     <h1>Login</h1>
        //     <p>Welcome to the login page</p>
        //     <form onSubmit={handleSubmit}>
        //         <div>
        //             <label htmlFor="username">Username:</label>
        //             <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
        //             <br />
        //             <label htmlFor="password">Password:</label>
        //             <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        //         </div>
        //         <button type="submit">Login</button>
        //     </form>
        // </div>
    );
}