import '../App.css'
import { Button } from '../stories/Button/Button'
import { TextInput } from '../stories/TextInput/TextInput'
import { Image } from '../stories/Image/Image'
import { Form } from '../stories/Form/Form'

import { useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'

import { env } from '../util'

function Login() {
    const [userNameEntered, setUserNameEntered] = useState('' as string)
    const [passwordEntered, setPasswordEntered] = useState('' as string)
    const [userpassEnabled, setUserpassEnabled] = useState(false as boolean)

    const navigate: NavigateFunction = useNavigate()

    async function handleSubmit(event: any) {
        event.preventDefault()
        navigate('/home', { state: { name: userNameEntered } })
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
                                size="large"
                                kind="outline"
                                show="block"
                                label="x509 Certificate"
                                type="submit"
                            />

                            <Button
                                size="large"
                                kind="outline"
                                show="block"
                                label="OIDC OAuth"
                                type="submit"
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
                                        />
                                    </div>
                                </>
                            ) : (
                                <Button
                                    size="large"
                                    kind="outline"
                                    show="block"
                                    label="Username / Password"
                                    onClick={() => {
                                        setUserpassEnabled(true)
                                    }}
                                />
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
