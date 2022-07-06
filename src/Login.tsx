import './App.css'
import { Button } from './stories/Button/Button'
import { TextInput } from './stories/TextInput/TextInput'
import { Image } from './stories/Image/Image'
import { Form } from './stories/Form/Form'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [userNameEntered, setUserNameEntered] = useState('')
    const [passwordEntered, setPasswordEntered] = useState('')

    const navigate = useNavigate()

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
                        <Image
                            src={require('./images/favicon.png')}
                            height={150}
                            width={150}
                        ></Image>
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
                                label="X509 Certificate"
                            />

                            <Button
                                size="large"
                                kind="outline"
                                show="block"
                                label="OIDC OAuth"
                            />

                            <TextInput
                                label="Username"
                                placeholder="Enter Username"
                                kind="info"
                                size="medium"
                                onChange={(event: any) => {
                                    setUserNameEntered(event.target.value)
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
                                        event.target.value.length,
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
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
