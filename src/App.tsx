import './App.css'

function App() {
    return (
        <div className="App">
            <div className="limiter">
                <div
                    className="container-login100"
                    style={{ backgroundColor: 'black' }}
                >
                    <div className="wrap-login100 p-l-110 p-r-110 p-t-62 p-b-33">
                        <form className="login100-form validate-form flex-sb flex-w">
                            <img src="https://rucio-ui.cern.ch/media/favicon.ico" />
                            <span className="login100-form-title p-b-27">
                                Rucio Login
                                <h4>Welcome to Rucio!</h4>
                            </span>

                            <a href="#" className="btn-face m-b-20">
                                <i className="fa fa-certificate"></i>
                                X509 Certificate
                            </a>

                            <a href="#" className="btn-face m-b-20">
                                <i className="fa fa-certificate"></i>
                                OIDC OAuth
                            </a>

                            <div className="p-t-31 p-b-9">
                                <span className="txt1">Username</span>
                            </div>
                            <div
                                className="wrap-input100 validate-input"
                                data-validate="Username is required"
                            >
                                <input
                                    className="input100"
                                    type="text"
                                    name="username"
                                />
                                <span className="focus-input100"></span>
                            </div>

                            <div className="p-t-13 p-b-9">
                                <span className="txt1">Password</span>

                                <a href="#" className="txt2 bo1 m-l-5">
                                    Forgot?
                                </a>
                            </div>
                            <div
                                className="wrap-input100 validate-input"
                                data-validate="Password is required"
                            >
                                <input
                                    className="input100"
                                    type="password"
                                    name="pass"
                                />
                                <span className="focus-input100"></span>
                            </div>

                            <div className="container-login100-form-btn m-t-17">
                                <button className="login100-form-btn">
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
