import { injectable } from "inversify";
import { UserpassLoginRequest, UserpassLoginResponse } from "../data/userpass-login";
import UserPassLoginInputPort from "../port/primary/userpass-login-input-port";
import type UserPassLoginOutputPort from "../port/primary/userpass-login-output-port";
import type AuthServerGatewayOutputPort from "../port/secondary/auth-server-gateway-output-port";

/**
 * UseCase for UserPassLogin workflow.
 */
@injectable()
class UserPassLoginUseCase implements UserPassLoginInputPort {
    
    constructor(
        private presenter: UserPassLoginOutputPort<any>,
        private authServer: AuthServerGatewayOutputPort
    ) {
        this.presenter = presenter;
    }
    async execute(request: UserpassLoginRequest): Promise<void> {
        const dto = await this.authServer.userpassLogin(request.username, request.password, request.account)
        if (dto.statusCode !== 200) {
            // this.presenter.presentError({
            //     message: dto.message,
            //     status: dto.statusCode,
            // })
            // return
        }
        const responseModel: UserpassLoginResponse = {
            rucioIdentity: request.username,
            rucioAccount: dto.account,
            rucioAuthType: 'userpass',
            rucioAuthToken: dto.authToken,
        }
        this.presenter.presentSuccess(responseModel)
    }
}

export default UserPassLoginUseCase;