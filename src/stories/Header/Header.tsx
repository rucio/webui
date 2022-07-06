import { Button } from '../Button/Button'
import './header.scss'

type User = {
    name: string
}

interface HeaderProps {
    user?: User
    onLogin: () => void
    onLogout: () => void
    onCreateAccount: () => void
}

export const Header = ({
    user,
    onLogin,
    onLogout,
    onCreateAccount,
}: HeaderProps) => (
    <header>
        <div className="wrapper">
            <div></div>
            <div>
                {user ? (
                    <>
                        <span className="welcome">
                            Welcome, <b>{user.name}</b>!
                        </span>
                        <Button
                            size="small"
                            onClick={() => {
                                alert('User logged out!')
                                onLogout()
                            }}
                            label="Log out"
                        />
                    </>
                ) : (
                    <>
                        <Button
                            size="small"
                            onClick={() => {
                                alert('User logged in!')
                                onLogin()
                            }}
                            label="Log in"
                        />
                        <Button
                            size="small"
                            onClick={() => {
                                alert('User sccount created!')
                                onCreateAccount()
                            }}
                            label="Sign up"
                        />
                    </>
                )}
            </div>
        </div>
    </header>
)
