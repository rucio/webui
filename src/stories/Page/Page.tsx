import React from 'react'

import { Header } from '../Header/Header'
import './page.css'

type User = {
    name: string
}

export const Page: React.VFC = () => {
    const [user, setUser] = React.useState<User>()

    return (
        <article>
            <Header
                user={user}
                onLogin={() => setUser({ name: 'Rucio' })}
                onLogout={() => setUser(undefined)}
                onCreateAccount={() => setUser({ name: 'Rucio' })}
            />
            <section>
                <h2>Lorem Ipsum</h2>
            </section>
        </article>
    )
}
