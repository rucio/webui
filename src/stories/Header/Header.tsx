import './header.scss'

import { MutableRefObject, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../Button/Button'
import { Image } from '../Image/Image'
import { Input } from '../Input/Input'
import { Navbar } from '../Navigation/Navbar'
import React from 'react'
import { StoreContext } from '../../App'

export const Header = ({
    menuActive = false,
    menuCollapsible = true,
    user,
    onLogin,
    onLogout,
    onCreateAccount,
}: HeaderProps) => {
    const [navIconClickToggle, setNavIconClickToggle] = useState(menuActive)
    const enteredPattern: MutableRefObject<string> = useRef('' as string)

    const { store } = React.useContext(StoreContext) as any
    const account = store?.account ?? sessionStorage.getItem('X-Rucio-Account')

    const navigate = useNavigate()
    const toggleNav = () => {
        setNavIconClickToggle(!navIconClickToggle)
    }
    const logout = () => {
        alert('User logged out!')
        sessionStorage.removeItem(
            'X-Rucio-Auth-Token',
        )
        sessionStorage.removeItem('X-Rucio-Account')
        navigate('/login')
        onLogout?.()
    }
    return (
        <header>
            <div className="wrapper">
                <span
                    style={{ float: 'left', cursor: 'pointer' }}
                    onClick={menuCollapsible ? toggleNav : args => args}
                >
                    <Image
                        src={require('../../images/favicon.png')}
                        height={50}
                        width={50}
                    ></Image>
                </span>

                <span className="rucio-flex">
                    <Input
                        name="pattern"
                        placeholder="search dids/rules"
                        focusByDefault
                        type="text"
                        size="small"
                        show="rounded"
                        onChange={(event: any) => {
                            enteredPattern.current = event?.target?.value
                        }}
                    ></Input>

                    <div className="m-t-5">
                        <Button
                            label="Search"
                            kind="primary"
                            type="button"
                            size="small"
                            onClick={() => {
                                navigate(
                                    `/search?pattern=${enteredPattern.current}`,
                                )
                            }}
                        />
                    </div>
                </span>

                <div>
                    {account ? (
                        <>
                            <span className="welcome">
                                Welcome, <b>{account}</b>!
                            </span>
                            <Button
                                size="small"
                                onClick={logout}
                                label="Log out"
                            />
                        </>
                    ) : (
                        <>
                            <Button
                                size="small"
                                onClick={() => {
                                    onLogin?.()
                                }}
                                label="Log in"
                            />
                            <Button
                                size="small"
                                onClick={() => {
                                    onCreateAccount?.()
                                }}
                                label="Sign up"
                            />
                        </>
                    )}
                </div>
            </div>
            <Navbar
                active={navIconClickToggle}
                menuItems={[
                    {
                        route: '/r2d2',
                        display: 'List Rules',
                    },
                    {
                        route: '/ruledef',
                        display: 'Create Rules',
                    },
                    {
                        route: '/home',
                        display: 'Home',
                    },
                    {
                        route: '/login',
                        display: 'Logout',
                        click: logout,
                    },
                ]}
            />
        </header>
    )
}
