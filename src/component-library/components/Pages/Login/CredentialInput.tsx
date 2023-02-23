import { Button } from "../../Button/Button";

export const CredentialInput = (
    props: { login: (args: unknown) => void, children: any }
) => {
    /*
    * Allows the user to input their credentials, submit button already implemented
    */
    return (
        <div className="m-6">
            {props.children}
            <div className="mt-2">
                <Button label="Login" type="submit" onClick={props.login} />
            </div>
        </div>
    )
}