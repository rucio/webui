import { Button } from "../../Button/Button";

export const CredentialInput = (
    props: { submitHandler: (args: unknown) => void, children: any }
) => {
    /*
    * Allows the user to input their credentials, submit button already implemented
    */
    return (
    <div className="mb-2 mr-10 ml-10">
            {props.children}
            <div className="mt-2">
                <Button label="Login" type="submit" onClick={props.submitHandler} />
            </div>
        </div>
    )
}