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

    const handleUpassSubmit = async (username: string, password: string) => {
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

    const mockUpassSubmit = async (username: string, password: string) => {
        if(username === "test" && password === "test"){
            const redirect: string = redirectURL
            router.push(redirect)
        }
        else {
            console.log("Invalid username or password")
        }
    };


    const handleSubmit = (
        response: LoginPageResponse
    ) => {
        console.log(`Username: ${response.username}, Password: ${response.password}, VO: ${response.vo}, Login Type: ${response.loginType}`);
        switch(response.loginType){
            case "upass":
                mockUpassSubmit(response.username, response.password)
                break;
            case "x509":
                console.log("x509 login not yet implemented")
                break;
        }
    }

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
                login={handleSubmit}
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