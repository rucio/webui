import '../App.css'
import { Button } from '../stories/Button/Button'
import { TextInput } from '../stories/TextInput/TextInput'
import { Image } from '../stories/Image/Image'
import { Form } from '../stories/Form/Form'

import { MutableRefObject, ReactElement, useRef, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { getData } from '../utils/restApiWrapper'

import { env } from '../util'
import { useAlert, useModal } from '../components/GlobalHooks'
import { AlertProps } from '../stories/Alert/Alert'
import { ModalProps } from '../stories/Modal/Modal'

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

    const navigate: NavigateFunction = useNavigate()
    const showAlert: (options: AlertProps) => Promise<void> = useAlert()
    const showModal: (options: ModalProps) => Promise<void> = useModal()

    const AccountInput: ReactElement = (
        <TextInput
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
        let headers
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
                        localStorage.setItem(
                            'X-Rucio-Auth-Token',
                            rucioAuthToken,
                        )
                        loginNavigateHome(rucioAccount)
                    } else if (response.status === 206) {
                        const has_accounts_header = response.headers.has(
                            'X-Rucio-Auth-Accounts',
                        )
                        if (!has_accounts_header) {
                            throw new Error(
                                'No X-Rucio-Auth-Accounts header found in response',
                            )
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
                        throw new Error('Login failed')
                    }
                } else {
                    showAlert({
                        message: 'Unable to fetch response from server.',
                        variant: 'error',
                    })
                }
                return response
            })
            .catch((error: Error) => {
                showAlert({
                    message: 'Unable to log in, please try again.',
                    variant: 'error',
                })
                console.error(error)
            })
    }

    const OAuth = () => {
        getData('/auth/oidc')
            .then(() => {
                sessionStorage.setItem(
                    'X-Rucio-Auth-Token',
                    'oidc_auth_sample_token',
                )
                navigate('/login')
            })
            .catch((error: Error) => {
                console.error(error)
                navigate('/login')
            })
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
        event.preventDefault()
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

                            <Button
                                type="submit"
                                size="large"
                                kind="outline"
                                show="block"
                                label="OIDC OAuth"
                                onClick={() => {
                                    authType.current = 'OAuth'
                                }}
                            />

                            {userpassEnabled ? (
                                <>
                                    <TextInput
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

                                    <TextInput
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
