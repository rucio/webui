import { injectable } from "inversify";
import { UserpassLoginResponse } from "../data/userpass-login";
import UserPassLoginInputPort from "../port/primary/userpass-login-input-port";
import type UserPassLoginOutputPort from "../port/primary/userpass-login-output-port";

@injectable()
class UserPassLoginUseCase implements UserPassLoginInputPort {

    constructor(private presenter: UserPassLoginOutputPort<any>) {
        this.presenter = presenter;
    }
    execute(
        username: string, 
        password: string, 
        account: string, 
    ): void {
        const responseModel: UserpassLoginResponse = {
            rucioIdentity: username,
            rucioAccount: account,
            rucioAuthType: 'userpass',
            rucioAuthToken: 'token' + password +  Math.random(),
        }
        this.presenter.presentSuccess(responseModel)
    }
}

export default UserPassLoginUseCase;