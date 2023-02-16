'use client';
import { AuthViewModel } from "@/lib/infrastructure/data/auth/auth";
import { LoginViewModel } from "@/lib/infrastructure/data/view-model/login";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirectURL, setRedirectURL] = useState<string>('/dashboard' as string)
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
                if (loginViewModel.isLoggedIn) {
                    router.push(redirectURL)
                }
            }
            )
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
        <div>
            <h1>Login</h1>
            <p>Welcome to the login page</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
                    <br />
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}