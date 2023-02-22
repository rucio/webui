import { Button } from "../../Button/Button";
import { Tabs } from "../../Tabs/Tabs";

export const Login = ({
}) => {

    return (
        <div
            className="border-gray-300 border rounded p-4 flex flex-col justify-center space-y-2"
        >
            <div className="">
                Login header
            </div>
            <div className="flex flex-col space-y-2">
                <Tabs tabs={["DID", "RSE", "Options", "Summary"]} active={1} />
                <div className="flex justify-center flex-col space-y-4">
                    <div className="flex flex-row justify-center space-x-2">
                        <Button label="OIDC 1" />
                        <Button label="OIDC 2" />
                    </div>
                    <div className="flex flex-col space-y-4">
                        <Button label="x509" />
                        <Button label="Userpass" />
                    </div>
                </div>
            </div>
        </div>
    )
}
