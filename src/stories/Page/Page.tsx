import React from 'react'

import { Header } from '../Header/Header'
import { Card } from '../Card/Card'
import { CardBody } from '../Card/components/CardBody'
import { CardFooter } from '../Card/components/CardFooter'
import { Form } from '../Form/Form'

type User = {
    name: string
}

export const Page: React.VFC = () => {
    const [user, setUser] = React.useState<User>()

    return (
        <div>
            <Header
                user={user}
                onLogin={() => setUser({ name: 'Rucio' })}
                onLogout={() => setUser(undefined)}
                onCreateAccount={() => setUser({ name: 'Rucio' })}
            />
            <Card title="Welcome to Rucio">
                <CardBody>
                    <Form></Form>
                </CardBody>
                <CardFooter />
            </Card>
        </div>
    )
}
