import { SetX509LoginSessionError, SetX509LoginSessionResponse } from "../../data/set-x509-login-session";

export default interface SetX509LoginSessionOutputPort<T> {
    response: T;
    presentSuccess(responseModel: SetX509LoginSessionResponse): Promise<void>;
    presentError(errorModel: SetX509LoginSessionError): Promise<void>;
}