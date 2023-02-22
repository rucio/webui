import { useState , useEffect } from 'react'
import { Button } from "../../Button/Button";
import { Tabs } from "../../Tabs/Tabs";
import { TextInput } from '../../Input/Input.stories';
import { H1 } from '../../Text/Headings/H1';
import { Collapsible } from '../../Helpers/Collapsible';

export const Login = ({
    loginViewModel,
    login,
}: LoginPageProps ) => {

    /**

     * Designing the login page
     */
    var mainDivClasses: string[] = ["border-gray-300", "border", "rounded", "p-4", "flex", "flex-col", "justify-center", "space-y-2"]


    /**
     * The type of login form to show
     */
    enum ShowLoginType {
        none,
        x509,
        upass,
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


    /**
     * The OIDC provider to use
     */
    const [oidcProvider, setOidcProvider] = useState<number>(1)


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
                    <Tabs tabs={loginViewModel.voList} active={1} handleClick={(event: any) => {setOidcProvider(event.target.id)}}/>
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
                        <div className={showLogin === ShowLoginType.upass ? "visible" : "collapse"}>
                            <div className="m-6">
                                <TextInput label="Username" inline/>
                                <TextInput label="Password" inline password/>
                                <div className="mt-2">
                                    <Button label="Login" type="submit" />
                                </div>
                            </div>
                        </div>
                        <div className={showLogin === ShowLoginType.x509 ? "visible" : "collapse"}>
                            input for x509 login
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
