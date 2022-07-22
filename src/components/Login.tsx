import '../App.css'
import { Button } from '../stories/Button/Button'
import { TextInput } from '../stories/TextInput/TextInput'
import { Image } from '../stories/Image/Image'
import { Form } from '../stories/Form/Form'

import { useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { getData } from '../utils/restApiWrapper'

import { env } from '../util'

const commonHeaders = {
    'X-Rucio-VO': 'def',
    'X-Rucio-Account': 'root',
    'X-Rucio-AppID': 'test',
}

function Login() {
    const [userNameEntered, setUserNameEntered] = useState('')
    const [passwordEntered, setPasswordEntered] = useState('')
    const [userpassEnabled, setUserpassEnabled] = useState(false)
    const [authType, setAuthType] = useState('')

    const navigate: NavigateFunction = useNavigate()

    const userPassAuth = () => {
        getData('/auth/userpass', '', {
            'X-Rucio-Username': userNameEntered,
            'X-Rucio-Password': passwordEntered,
            ...commonHeaders,
        })
            .then((data: any) => {
                if (data?.ok) {
                    const rucioAuthToken =
                        data?.headers.get('X-Rucio-Auth-Token')
                    sessionStorage.setItem('X-Rucio-Auth-Token', rucioAuthToken)
                    navigate('/home', { state: { name: userNameEntered } })
                } else {
                    navigate('/login')
                }
            })
            .catch((error: any) => {
                console.error(error)
            })
    }

    const OAuth = () => {
        getData('/auth/oidc')
            .then((data: any) => {
                sessionStorage.setItem(
                    'X-Rucio-Auth-Token',
                    'oidc_auth_sample_token',
                )
                navigate('/login')
            })
            .catch((error: any) => {
                console.error(error)
                navigate('/login')
            })
    }

    const x509Auth = () => {
        getData('/auth/x509')
            .then((data: any) => {
                sessionStorage.setItem(
                    'X-Rucio-Auth-Token',
                    'x509_sample_token',
                )
                navigate('/login')
            })
            .catch((error: any) => {
                console.error(error)
                navigate('/login')
            })
    }

    async function handleSubmit(event: any) {
        event.preventDefault()
        if (authType == 'x509') {
            x509Auth()
        } else if (authType == 'OAuth') {
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
                                    setAuthType('x509')
                                }}
                            />

                            <Button
                                type="submit"
                                size="large"
                                kind="outline"
                                show="block"
                                label="OIDC Auth"
                                onClick={() => {
                                    setAuthType('OAuth')
                                }}
                            />

                            {userpassEnabled ? (
                                <>
                                    <TextInput
                                        label="Username"
                                        placeholder="Enter Username"
                                        kind="info"
                                        size="medium"
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

                                    <TextInput
                                        label="Account Name"
                                        placeholder="Enter Account Name (optional)"
                                        size="medium"
                                        kind="primary"
                                    />

                                    <div className="container-login100-form-btn m-t-17">
                                        <Button
                                            size="large"
                                            kind="primary"
                                            show="block"
                                            label="Sign In"
                                            type="submit"
                                            disabled={
                                                passwordEntered.length == 0 ||
                                                userNameEntered.length == 0
                                            }
                                            onClick={() => {
                                                setAuthType('userpass')
                                            }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Button
                                        size="large"
                                        kind="outline"
                                        show="block"
                                        label="Username / Password"
                                        onClick={() => {
                                            setUserpassEnabled(true)
                                        }}
                                    />
                                    <TextInput
                                        label="Account Name"
                                        placeholder="Enter Account Name (optional)"
                                        size="medium"
                                        kind="normal"
                                    />
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
