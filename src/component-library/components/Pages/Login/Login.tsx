import { useState , useEffect } from 'react'
import { Button } from "../../Button/Button";
import { Tabs } from "../../Tabs/Tabs";
import { TextInput } from '../../Input/Input.stories';

export const Login = ({
}) => {
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
    return (
        <div
            className="border-gray-300 border rounded p-4 flex flex-col justify-center space-y-2"
        >
            <div className="text-center">
                <h1 className="text-4xl font-extrabold leading-none mt-4">Rucio Login</h1>
            </div>
            <div className="flex flex-col space-y-2">
                <Tabs tabs={["VO1", "VO2", "Another VO", "And a fourth"]} active={1} />
                <div className="flex justify-center flex-col space-y-4">
                    <div className="flex flex-row justify-center space-x-2">
                        <Button label="OIDC 1" />
                        <Button label="OIDC 2" />
                    </div>
                    <div className="flex flex-col space-y-4">
                        <Button label="x509" onClick={switchLoginForm(ShowLoginType.x509)}/>
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
