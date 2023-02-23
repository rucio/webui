import { useState , useEffect } from 'react'
import { Button } from "../../Button/Button";
import { Tabs } from "../../Tabs/Tabs";
import { TextInput } from '../../Input/Input.stories';
import { H1 } from '../../Text/Headings/H1';
import { Collapsible } from '../../Helpers/Collapsible';
import { CredentialInput } from './CredentialInput';

export const Login = ({
    loginViewModel,
    login,
}: LoginPageProps ) => {

    /**
     * Designing the login page
     */
    var mainDivClasses: string[] = ["border-gray-300", "border", "rounded", "p-4", "flex", "flex-col", "justify-center", "space-y-2"]


    /**
     * State variables
     */

    // Login type
    enum ShowLoginType {
        none = "none",
        x509 = "x509",
        upass = "upass",
    }
    const [showLogin, setShowLogin] = useState<ShowLoginType>(ShowLoginType.none)
    var switchLoginForm = (choice: ShowLoginType) => {
        if (showLogin === choice) {
            return () => {setShowLogin(ShowLoginType.none)}
        }
        else {
            return () => {setShowLogin(choice)}
        }
    }

    // VO setting
    const [vosetting, set_vosetting] = useState<number>(1)

    // Username and password
    const [unamesetting, set_unamesetting] = useState<string>("")
    const [passwordsetting, set_passwordsetting] = useState<string>("")

    /**
     * Preparing the response
     */
    const prepareResponse = () => {
        login(
            {
                loginType: showLogin,
                vo: loginViewModel.voList[vosetting],
                username: showLogin == ShowLoginType.upass ? unamesetting : "",
                password: showLogin == ShowLoginType.upass ? passwordsetting : "",
            }
        )
    }

    /**
     * Building the login form
     */
    return (
        <div className={mainDivClasses.join(" ")}>
            <div className="text-center">
                <H1 text="Rucio Login" />
            </div>
            <div className="flex flex-col space-y-2">
                <Collapsible show={loginViewModel.multiVOEnabled}>
                    <Tabs tabs={loginViewModel.voList} active={1} handleClick={(event: any) => {set_vosetting(event.target.id)}}/>
                </Collapsible>
                <div className="flex justify-center flex-col space-y-4">
                    <Collapsible show={loginViewModel.oidcEnabled}>
                        <div className="flex flex-row justify-center space-x-2">
                            {loginViewModel.oidcProviders.map((provider: string, index: number) => {
                                return (<Button label={provider} key={index.toString()}/>)
                            })}
                        </div>
                    </Collapsible>
                    <div className="flex flex-col space-y-4">
                        <Collapsible show={loginViewModel.x509Enabled}>
                            <Button label="x509" onClick={switchLoginForm(ShowLoginType.x509)}/>
                        </Collapsible>
                        <Button label="Userpass" onClick={switchLoginForm(ShowLoginType.upass)}/> 
                        <Collapsible show={showLogin == ShowLoginType.upass}>
                            <CredentialInput login={prepareResponse}>
                                <TextInput label="Username" inline onChange={(event) => {set_unamesetting(event.target.value)}}/>
                                <TextInput label="Password" inline password onChange={(event) => {set_passwordsetting(event.target.value)}}/>
                            </CredentialInput>
                        </Collapsible>
                        <Collapsible show={showLogin == ShowLoginType.x509}>
                            <CredentialInput login={prepareResponse}>
                                x509 Login
                            </CredentialInput>
                        </Collapsible>
                    </div>
                </div>
            </div>
        </div>
    )
}
