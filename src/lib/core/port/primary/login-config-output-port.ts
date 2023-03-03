import { LoginConfigResponse, LoginConfigError } from "../../data/login-config";

/**
 * Defines the output port for the login config use case. This interface muse be implemented by the
 * Presenter for the login config use case. {@type T} is the type of the presenter i.e. HTTPResponse or other.
 */
export default interface LoginConfigOutputPort<T> {
    response: T;
    presentSuccess(responseModel: LoginConfigResponse): Promise<void>;
    presentError(error: LoginConfigError): Promise<void>;
}