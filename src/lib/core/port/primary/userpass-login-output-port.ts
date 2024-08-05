import { UserpassLoginError, UserpassLoginResponse, UserpassLoginIncomplete } from "../../usecase-models/userpass-login-usecase-models";

/**
 * Defines the output port for the userpass login use case. This interface muse be implemented by the
 * Presenter for the userpass login use case. {@type T} is the type of the presenter i.e. HTTPResponse or other.
 */
export default interface UserPassLoginOutputPort<T> {
    response: T;
    presentSuccess(responseModel: UserpassLoginResponse): Promise<void>;
    presentIncomplete(incompleteModel: UserpassLoginIncomplete): Promise<void>;
    presentError(error: UserpassLoginError): Promise<void>;
}