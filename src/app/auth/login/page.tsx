'use client';
import { useState } from "react";
import useUser from "@/lib/infrastructure/hooks/useUser";


export default function Login() {
    const [username, setUsername] = useState('');
    const { mutateUser } = useUser({
        redirectTo: '/dashboard',
        redirectIfFound: true,
      })  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
              
        
        // Add your authentication logic here
        const body = {
            username: event.currentTarget.username.value,
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
                const user = await res.json()
                mutateUser(user)
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
            </div>
            <button type="submit">Login</button>
        </form>
        </div>
    );
    }