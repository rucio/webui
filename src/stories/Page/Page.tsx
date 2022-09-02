import React from 'react'

import { Header } from '../Header/Header'
import { Box } from '../Box/Box'
import { BoxBody } from '../Box/components/BoxBody'
import { BoxFooter } from '../Box/components/BoxFooter'
import { Form } from '../Form/Form'

type User = {
    name: string
    children?: any
}

export const Page: React.VFC = (children: any) => {
    const [user, setUser] = React.useState<User>()

    return (
        <div>
            <Header
                user={user}
                onLogin={() => setUser({ name: 'Rucio' })}
                onLogout={() => setUser(undefined)}
                onCreateAccount={() => setUser({ name: 'Rucio' })}
            />
            <Box title="Welcome to Rucio">
                <BoxBody>
                    <Form></Form>
                </BoxBody>
                <BoxFooter />
            </Box>
        </div>
    )
}
