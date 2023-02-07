import { injectable } from "inversify";
import { UserpassLoginRequest, UserpassLoginResponse } from "../data/userpass-login";
import UserPassLoginInputPort from "../port/primary/userpass-login-input-port";
import type UserPassLoginOutputPort from "../port/primary/userpass-login-output-port";

/**
 * UseCase for UserPassLogin workflow.
 */
@injectable()
class UserPassLoginUseCase implements UserPassLoginInputPort {

    constructor(private presenter: UserPassLoginOutputPort<any>) {
        this.presenter = presenter;
    }
    execute(request: UserpassLoginRequest):void {
        const responseModel: UserpassLoginResponse = {
            rucioIdentity: request.username,
            rucioAccount: request.account,
            rucioAuthType: 'userpass',
            rucioAuthToken: 'token' + request.account +  Math.random(),
        }
        this.presenter.presentSuccess(responseModel)
    }
}

export default UserPassLoginUseCase;