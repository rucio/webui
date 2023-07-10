import { injectable } from "inversify";
import { AccountAttributesDTO } from "../dto/account-dto";
import { UserpassLoginRequest, UserpassLoginResponse, UserpassLoginError } from "../usecase-models/userpass-login-usecase-models";
import { Role } from "../entity/auth-models";
import UserPassLoginInputPort from "../port/primary/userpass-login-input-port";
import type UserPassLoginOutputPort from "../port/primary/userpass-login-output-port";
import type AccountGatewayOutputPort from "../port/secondary/account-gateway-output-port";
import type AuthServerGatewayOutputPort from "../port/secondary/auth-server-gateway-output-port";

/**
 * UseCase for UserPassLogin workflow.
 */
@injectable()
class UserPassLoginUseCase implements UserPassLoginInputPort {
    constructor(
        private presenter: UserPassLoginOutputPort<any>,
        private authServer: AuthServerGatewayOutputPort,
        private rucioAccountGateway: AccountGatewayOutputPort,
    ) {
        this.presenter = presenter;
        this.authServer = authServer;
        this.rucioAccountGateway = rucioAccountGateway;
    }
    async execute(request: UserpassLoginRequest): Promise<void> {
        const dto = await this.authServer.userpassLogin(request.username, request.password, request.account, request.vo)
        let role: Role | undefined;
        let country: string | undefined;
        let countryRole: Role | undefined;
        try {
            const accountAttrs: AccountAttributesDTO = await this.rucioAccountGateway.listAccountAttributes(request.account, dto.authToken)
            accountAttrs.attributes.forEach((attr) => {
                if(attr.key == 'admin' && attr.value == 'True') {
                    role = Role.ADMIN;
                }
                else if(attr.key.startsWith('country-')) {
                    country = attr.key.split('-')[1];
                    if(attr.value == 'admin') {
                        countryRole = Role.ADMIN;
                    }else if(attr.value == 'user') {
                        countryRole = Role.USER;
                    } else {
                        countryRole = undefined;
                    }
                }else {
                    role = Role.USER;
                }
            })
        } catch(error: AccountAttributesDTO | any) {
            role = undefined;
        }
        if(dto.statusCode == 200) {
            const responseModel: UserpassLoginResponse = {
                rucioIdentity: request.username,
                rucioAccount: dto.account,
                rucioAuthToken: dto.authToken,
                rucioAuthTokenExpires: dto.authTokenExpires,
                vo: request.vo,
                role: role,
                country: country,
                countryRole: countryRole,
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