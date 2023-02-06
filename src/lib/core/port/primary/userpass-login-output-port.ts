import { UserpassLoginError, UserpassLoginResponse } from "../../data/userpass-login";

/**
 * Defines the output port for the userpass login use case. This interface muse be implemented by the
 * Presenter for the userpass login use case.
 */
export default interface UserPassLoginOutputPort<T> {
    response: T;
    presentSuccess(responseModel: UserpassLoginResponse): void;
    presentError(error: UserpassLoginError): void;
    setResponseHandler(handler: T): void;
}