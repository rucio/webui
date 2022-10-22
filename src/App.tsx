import './App.scss'
import React, { useState } from 'react'
import {
    Routes,
    Route,
    Navigate,
    useNavigate,
    NavigateFunction,
} from 'react-router-dom'

import { ErrorBoundaryWrapper } from './components/ErrorBoundary'
import { ServiceProvider } from './components/GlobalHooks'

import { DID } from './components/DID'
import { ListRules } from './components/ListRules'
import { Rule } from './components/Rule'
import { RuleDef } from './components/RuleDef'
import { Search } from './components/Search'

import Home from './components/Home'
import Login from './components/Login'
import NotFound from './components/NotFound'

export const StoreContext = React.createContext({})

const App = () => {
    const [store, updateStore] = useState({ displaySideBar: true } as any)
    const navigate: NavigateFunction = useNavigate()

    const ProtectedRoute = ({ redirectPath = '/login', children = <></> }) => {
        if (
            !store?.account &&
            !sessionStorage.getItem('X-Rucio-Auth-Token') &&
            !sessionStorage.getItem('X-Rucio-Account')
        ) {
            return <Navigate to={redirectPath} replace />
        }
        return children
    }

    const protectedPathElementMap: any[] = [
        {
            path: '/home',
            element: <Home />,
        },
        {
            path: '/ruledef',
            element: <RuleDef />,
        },
        {
            path: '/r2d2',
            element: <ListRules />,
        },
        {
            path: '/did',
            element: <DID />,
        },
        {
            path: '/search',
            element: <Search />,
        },
        {
            path: '/rule',
            element: <Rule />,
        },
    ]

    return (
        <StoreContext.Provider value={{ store, updateStore }}>
            <ServiceProvider>
                <Routes>
                    <Route
                        index
                        element={
                            <ErrorBoundaryWrapper>
                                <Login
                                    onLoginSuccess={(args: any) => {
                                        updateStore({ account: args })
                                        sessionStorage.setItem(
                                            'X-Rucio-Account',
                                            args,
                                        )
                                        navigate('/home')
                                    }}
                                    onLoginFailure={() => {
                                        updateStore({ account: null })
                                        sessionStorage.removeItem(
                                            'X-Rucio-Account',
                                        )
                                        sessionStorage.removeItem(
                                            'X-Rucio-Auth-Token',
                                        )
                                    }}
                                />
                            </ErrorBoundaryWrapper>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <ErrorBoundaryWrapper>
                                <Login
                                    onLoginSuccess={(args: any) => {
                                        updateStore({ account: args })
                                        sessionStorage.setItem(
                                            'X-Rucio-Account',
                                            args,
                                        )
                                        navigate('/home')
                                    }}
                                    onLoginFailure={() => {
                                        updateStore({ account: null })
                                        sessionStorage.removeItem(
                                            'X-Rucio-Account',
                                        )
                                        sessionStorage.removeItem(
                                            'X-Rucio-Auth-Token',
                                        )
                                    }}
                                />
                            </ErrorBoundaryWrapper>
                        }
                    />
                    {protectedPathElementMap.map(
                        ({ path, element }: any, index: number) => (
                            <Route
                                key={index}
                                path={path}
                                element={
                                    <ProtectedRoute>
                                        <ErrorBoundaryWrapper>
                                            {element}
                                        </ErrorBoundaryWrapper>
                                    </ProtectedRoute>
                                }
                            />
                        ),
                    )}
                    <Route path="/*" element={<NotFound />} />
                </Routes>
            </ServiceProvider>
        </StoreContext.Provider>
    )
}

export default App
