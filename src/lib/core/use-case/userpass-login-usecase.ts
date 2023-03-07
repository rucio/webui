import { injectable } from "inversify";
import { UserpassLoginRequest, UserpassLoginResponse, UserpassLoginError } from "../data/userpass-login";
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
        this.authServer = authServer;
    }
    async execute(request: UserpassLoginRequest): Promise<void> {
        const dto = await this.authServer.userpassLogin(request.username, request.password, request.account)
        if(dto.statusCode == 200) {
            const responseModel: UserpassLoginResponse = {
                rucioIdentity: request.username,
                rucioAccount: dto.account,
                rucioAuthToken: dto.authToken,
                rucioAuthTokenExpires: dto.authTokenExpires,
            }
            await this.presenter.presentSuccess(responseModel)
            return;
        } 
        let error_type: 'AUTH_SERVER_CONFIGURATION_ERROR' | 'AUTH_SERVER_SIDE_ERROR' | 'INVALID_CREDENTIALS' | 'UNKNOWN_ERROR'
        switch(dto.statusCode){
            case 500: error_type = 'AUTH_SERVER_SIDE_ERROR'; break;
            case 502: error_type = 'AUTH_SERVER_SIDE_ERROR'; break;
            case 503: error_type = 'AUTH_SERVER_CONFIGURATION_ERROR'; break;
            case 401: error_type = 'INVALID_CREDENTIALS'; break;
            default: error_type = 'UNKNOWN_ERROR'; break;
        }
        const errorModel: UserpassLoginError = {
            type: error_type,
            message: dto.message,
        }
        await this.presenter.presentError(errorModel)
        return;
    }
}

export default UserPassLoginUseCase;