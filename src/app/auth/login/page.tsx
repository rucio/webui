'use client';
import { AuthViewModel } from "@/lib/infrastructure/data/auth/auth";
import { useEffect, useState } from "react";


export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    useEffect(() => {

    }, []);
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const body = {
            username: event.currentTarget.username.value,
            password: event.currentTarget.password.value,
          }
        try{
            const res = await fetch('/api/auth/userpass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
            if (res.status === 200) {
                const auth: AuthViewModel = await res.json()
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