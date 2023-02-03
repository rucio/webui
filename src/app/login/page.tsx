'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Login() {
    const [username, setUsername] = useState('');
    const router = useRouter();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Add your authentication logic here
        const body = {
            username: event.currentTarget.username.value,
          }
        console.log(body);
        // router.push('/dashboard');
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
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
            </div>
            <button type="submit">Login</button>
        </form>
        </div>
    );
    }