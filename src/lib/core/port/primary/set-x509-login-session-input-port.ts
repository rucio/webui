import { SetX509LoginSessionRequest } from '../../usecase-models/set-x509-login-session-usecase-models';

/**
 * @interface SetX509LoginSessionInputPort to set trigger setting up the IronSession in the Presenter
 * after a successful x509 login.
 */
export default interface SetX509LoginSessionInputPort {
    execute(requestModel: SetX509LoginSessionRequest): void;
}
