import '../App.css'
import { Button } from '../stories/Button/Button'
import { Input } from '../stories/Input/Input'
import { Image } from '../stories/Image/Image'
import { Form } from '../stories/Form/Form'

import { MutableRefObject, ReactElement, useRef, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { useAuth } from 'react-oidc-context'
import { getData } from '../utils/restApiWrapper'

import { env } from '../util'
import { useAuthConfig, useAlert, useModal } from '../components/GlobalHooks'
import { AlertProps } from '../stories/Alert/Alert'
import { ModalProps } from '../stories/Modal/Modal'
import { AuthError } from '../utils/exceptions'
import { RucioClient } from '../client'

export const commonHeaders = {
    'X-Rucio-VO': 'def',
    'X-Rucio-AppID': 'test',
    'X-Rucio-Script': 'webui::login',
}

function Login() {
    const [userNameEntered, setUserNameEntered] = useState('')
    const [passwordEntered, setPasswordEntered] = useState('')
    const [userpassEnabled, setUserpassEnabled] = useState(false)
    const [accountName, setAccountName] = useState('')

    const authType: MutableRefObject<string> = useRef('')
    const oidcProvider: MutableRefObject<string> = useRef('')

    const auth = useAuth()
    const navigate: NavigateFunction = useNavigate()
    const showAlert: (options: AlertProps) => Promise<void> = useAlert()
    const showModal: (options: ModalProps) => Promise<void> = useModal()
    const setOidcConfig: (options: ModalProps) => Promise<void> =
        useAuthConfig()

    const AccountInput: ReactElement = (
        <Input
            label="Account Name (Optional)"
            placeholder={accountName}
            size="medium"
            kind="primary"
            onChange={(event: any) => {
                setAccountName(event?.target?.value)
            }}
        />
    )

    const SignInButton: ReactElement = (
        <div className="container-login100-form-btn m-t-17">
            <Button
                size="large"
                kind="primary"
                show="block"
                label="Sign In"
                type="submit"
                disabled={
                    passwordEntered.length === 0 || userNameEntered.length === 0
                }
                onClick={() => {
                    authType.current = 'userpass'
                }}
            />
        </div>
    )

    const loginNavigateHome = (account: string) => {
        showAlert({
            message: 'Login successful!',
            variant: 'success',
        })
        navigate('/home', {
            state: { name: account },
        })
    }

    const makeUserPassAuthFetch = (): Promise<unknown> => {
        let headers = {}
        if (accountName.length === 0) {
            headers = {
                'X-Rucio-Username': userNameEntered,
                'X-Rucio-Password': passwordEntered,
            }
        } else {
            headers = {
                'X-Rucio-Username': userNameEntered,
                'X-Rucio-Password': passwordEntered,
                'X-Rucio-Account': accountName,
            }
        }

        return getData('/auth/userpass', '', {
            ...commonHeaders,
            ...headers,
        })
    }

    const userPassAuth = () => {
        makeUserPassAuthFetch()
            .then((response: any) => {
                if (response) {
                    if (response.status === 200) {
                        const rucioAuthToken =
                            response?.headers.get('X-Rucio-Auth-Token')
                        const rucioAccount = response?.headers.get(
                            'X-Rucio-Auth-Account',
                        )
                        setAccountName(rucioAccount)
                        sessionStorage.setItem(
                            'X-Rucio-Auth-Token',
                            rucioAuthToken,
                        )
                        loginNavigateHome(rucioAccount)
                    } else if (response.status === 206) {
                        const has_accounts_header = response.headers.has(
                            'X-Rucio-Auth-Accounts',
                        )
                        if (!has_accounts_header) {
                            throw AuthError.fromType('USERPASS_NO_HEADER')
                        }
                        const accounts = response?.headers
                            .get('X-Rucio-Auth-Accounts')
                            .split(',')
                        showModal({
                            title: 'Select Rucio Account',
                            body: (
                                <Form
                                    title=""
                                    subtitle="We detected multiple accounts for
                            this user, please select the desired
                            one."
                                    onSubmit={() => {
                                        showModal({ active: false })
                                    }}
                                >
                                    {accounts.map((element: string) => (
                                        <label key={element}>
                                            <input
                                                type="radio"
                                                id={element}
                                                value={element}
                                                name="radio-group"
                                                defaultChecked={false}
                                                onChange={(event: any) => {
                                                    setAccountName(
                                                        event.target.value,
                                                    )
                                                }}
                                            />
                                            &nbsp;{element}
                                        </label>
                                    ))}
                                    <Button
                                        size="large"
                                        kind="primary"
                                        show="block"
                                        label="Select Account"
                                        type="submit"
                                    />
                                </Form>
                            ),
                        })
                    } else if (response.status === 401) {
                        showAlert({
                            message: 'Invalid credentials',
                            variant: 'error',
                        })
                    } else {
                        showAlert({
                            message: 'Login failed.',
                            variant: 'error',
                        })
                        throw AuthError.fromType('COMMON_LOGIN_FAILED')
                    }
                } else {
                    showAlert({
                        message: 'Unable to fetch response from server.',
                        variant: 'error',
                    })
                    throw AuthError.fromType('COMMON_LOGIN_FAILED')
                }
            })
            .catch((error: Error) => {
                setTimeout(() => {
                    showAlert({
                        message: 'Unable to log in, please try again.',
                        variant: 'error',
                    })
                }, 5000)
                console.error(error)
            })
    }

    const OAuth = () => {
        try {
            const oidcProviderId: string =
                'oidc_provider_' + oidcProvider.current
            if (env(oidcProviderId)) {
                const newOidcConfig = {} as any
                newOidcConfig.authority = env(oidcProviderId + '_authority')
                newOidcConfig.client_id = env(oidcProviderId + '_client_id')
                newOidcConfig.client_secret = env(
                    oidcProviderId + '_client_secret',
                )
                newOidcConfig.redirect_uri = env(
                    oidcProviderId + '_redirect_uri',
                )
                setOidcConfig(newOidcConfig)
                setTimeout(() => {
                    auth.signinRedirect()
                }, 2500)
            } else {
                throw AuthError.fromType('OIDC_PROVIDER_NOT_FOUND')
            }
        } catch {
            showAlert({
                message: 'Something went wrong, please try again.',
                variant: 'warn',
            })
        }
    }

    const x509Auth = () => {
        getData('/auth/x509')
            .then(() => {
                sessionStorage.setItem(
                    'X-Rucio-Auth-Token',
                    'x509_sample_token',
                )
                navigate('/login')
            })
            .catch((error: Error) => {
                console.error(error)
                navigate('/login')
            })
    }

    async function handleSubmit(event: any) {
        event?.preventDefault()
        const currentAuthType: string = authType.current
        if (currentAuthType === 'x509') {
            x509Auth()
        } else if (currentAuthType === 'OAuth') {
            OAuth()
        } else {
            userPassAuth()
        }
    }

    return (
        <div className="App">
            <div className="limiter">
                <div
                    className="container-login100"
                    style={{ backgroundColor: 'black' }}
                >
                    <div className="wrap-login100 p-l-50 p-r-50 p-t-62 p-b-33">
                        <div className="rucio-flex">
                            {env('login_page_image_primary') ? (
                                <div className="rucio-flex-item">
                                    <Image
                                        src={require('../' +
                                            env('login_page_image_primary'))}
                                        height={150}
                                        width={150}
                                    ></Image>
                                </div>
                            ) : null}

                            <div className="rucio-flex-item">
                                <Image
                                    src={require('../images/favicon.png')}
                                    height={150}
                                    width={150}
                                ></Image>
                            </div>

                            {env('login_page_image_secondary') ? (
                                <div className="rucio-flex-item">
                                    <Image
                                        src={require('../' +
                                            env('login_page_image_secondary'))}
                                        height={150}
                                        width={150}
                                    ></Image>
                                </div>
                            ) : null}
                        </div>
                        <br></br>
                        <span className="login100-form-title p-b-27">
                            <strong>Rucio Login</strong>
                            <br></br>
                            Welcome to Rucio!
                        </span>

                        <Form title="" subtitle="" onSubmit={handleSubmit}>
                            <div className="rucio-flex">
                                {env('oidc_provider_1') ? (
                                    <div className="rucio-flex-item">
                                        <Button
                                            icon={
                                                <svg
                                                    className="octicon"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 16 16"
                                                    width="16"
                                                    height="16"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z"
                                                    ></path>
                                                </svg>
                                            }
                                            type="submit"
                                            kind="outline"
                                            label="Google"
                                            show="invisible"
                                            size="large"
                                            onClick={() => {
                                                authType.current = 'OAuth'
                                                oidcProvider.current = '1'
                                            }}
                                        />
                                    </div>
                                ) : null}
                                {env('oidc_provider_2') ? (
                                    <div className="rucio-flex-item">
                                        <Button
                                            icon={
                                                <svg
                                                    className="octicon"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 16 16"
                                                    width="16"
                                                    height="16"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z"
                                                    ></path>
                                                </svg>
                                            }
                                            type="submit"
                                            kind="outline"
                                            label="GitHub"
                                            show="invisible"
                                            size="large"
                                            onClick={() => {
                                                authType.current = 'OAuth'
                                                oidcProvider.current = '2'
                                            }}
                                        />
                                    </div>
                                ) : null}
                                {env('oidc_provider_3') ? (
                                    <div className="rucio-flex-item">
                                        <Button
                                            icon={
                                                <svg
                                                    className="octicon"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 16 16"
                                                    width="16"
                                                    height="16"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z"
                                                    ></path>
                                                </svg>
                                            }
                                            type="submit"
                                            kind="outline"
                                            label="LinkedIn"
                                            show="invisible"
                                            size="large"
                                            onClick={() => {
                                                authType.current = 'OAuth'
                                                oidcProvider.current = '3'
                                            }}
                                        />
                                    </div>
                                ) : null}
                            </div>
                            <br></br>
                            <Button
                                type="submit"
                                size="large"
                                kind="outline"
                                show="block"
                                label="x509 Certificate"
                                onClick={() => {
                                    authType.current = 'x509'
                                }}
                            />

                            {userpassEnabled ? (
                                <>
                                    <Input
                                        label="Username"
                                        placeholder="Enter Username"
                                        kind="info"
                                        size="medium"
                                        focusByDefault
                                        onChange={(event: any) => {
                                            setUserNameEntered(
                                                event.target.value,
                                            )
                                        }}
                                    />

                                    <Input
                                        label="Password"
                                        placeholder="Enter Password"
                                        kind="info"
                                        size="medium"
                                        type="password"
                                        onChange={(event: any) => {
                                            setPasswordEntered(
                                                event.target.value,
                                            )
                                        }}
                                    />

                                    {AccountInput}
                                    {SignInButton}
                                </>
                            ) : null}
                        </Form>
                        <br></br>
                        {!userpassEnabled ? (
                            <>
                                <Button
                                    size="large"
                                    kind="outline"
                                    show="block"
                                    label="Username / Password"
                                    onClick={(event: any) => {
                                        event.preventDefault()
                                        setUserpassEnabled(true)
                                    }}
                                />
                                {AccountInput}
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
