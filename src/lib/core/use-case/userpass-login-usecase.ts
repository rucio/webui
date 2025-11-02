import { injectable } from 'inversify';
import { AccountAttributesDTO } from '../dto/account-dto';
import {
    UserpassLoginRequest,
    UserpassLoginResponse,
    UserpassLoginError,
    UserpassLoginIncomplete,
} from '../usecase-models/userpass-login-usecase-models';
import { Role } from '../entity/auth-models';
import UserPassLoginInputPort from '../port/primary/userpass-login-input-port';
import type UserPassLoginOutputPort from '../port/primary/userpass-login-output-port';
import type AccountGatewayOutputPort from '../port/secondary/account-gateway-output-port';
import type AuthServerGatewayOutputPort from '../port/secondary/auth-server-gateway-output-port';
import type EnvConfigGatewayOutputPort from '../port/secondary/env-config-gateway-output-port';

/**
 * UseCase for UserPassLogin workflow.
 */
@injectable()
class UserPassLoginUseCase implements UserPassLoginInputPort {
    constructor(
        private presenter: UserPassLoginOutputPort<any>,
        private authServer: AuthServerGatewayOutputPort,
        private rucioAccountGateway: AccountGatewayOutputPort,
        private envConfigGateway: EnvConfigGatewayOutputPort,
    ) {
        this.presenter = presenter;
        this.authServer = authServer;
        this.rucioAccountGateway = rucioAccountGateway;
        this.envConfigGateway = envConfigGateway;
    }
    async execute(request: UserpassLoginRequest): Promise<void> {
        console.log('[LOGIN FLOW 10] UserPassLoginUseCase execute started', {
            username: request.username,
            account: request.account || '(none)',
            vo: request.vo,
            redirectTo: request.redirectTo,
        });

        const userpassLoginEnabled = await this.envConfigGateway.userpassEnabled();
        console.log('[LOGIN FLOW 10a] Userpass enabled:', userpassLoginEnabled);

        if (!userpassLoginEnabled) {
            const errorModel: UserpassLoginError = {
                type: 'AUTH_SERVER_CONFIGURATION_ERROR',
                message: 'Userpass login is not enabled',
            };
            await this.presenter.presentError(errorModel);
            return;
        }
        const dto = await this.authServer.userpassLogin(request.username, request.password, request.account, request.vo);
        console.log('[LOGIN FLOW 11] Auth server response received', {
            statusCode: dto.statusCode,
            account: dto.account,
            hasToken: !!dto.authToken,
            message: dto.message,
        });

        let role: Role | undefined;
        let country: string | undefined;
        let countryRole: Role | undefined;
        try {
            const accountAttrs: AccountAttributesDTO = await this.rucioAccountGateway.listAccountAttributes(request.account, dto.authToken);
            accountAttrs.attributes.forEach(attr => {
                if (attr.key == 'admin' && attr.value == 'True') {
                    role = Role.ADMIN;
                } else if (attr.key.startsWith('country-')) {
                    country = attr.key.split('-')[1];
                    if (attr.value == 'admin') {
                        countryRole = Role.ADMIN;
                    } else if (attr.value == 'user') {
                        countryRole = Role.USER;
                    } else {
                        countryRole = undefined;
                    }
                } else {
                    role = Role.USER;
                }
            });
        } catch (error: AccountAttributesDTO | any) {
            role = undefined;
        }
        if (dto.statusCode == 200) {
            console.log('[LOGIN FLOW 12] Success response - creating session', {
                rucioAccount: dto.account,
                role,
                country,
                countryRole,
            });

            const responseModel: UserpassLoginResponse = {
                rucioIdentity: request.username,
                rucioAccount: dto.account,
                rucioAuthToken: dto.authToken,
                rucioAuthTokenExpires: dto.authTokenExpires,
                vo: request.vo,
                role: role,
                country: country,
                countryRole: countryRole,
            };
            await this.presenter.presentSuccess(responseModel);
            return;
        }
        if (dto.statusCode === 206) {
            console.log('[LOGIN FLOW 13a] Multiple accounts detected', {
                availableAccounts: dto.message,
            });

            const incompleteModel: UserpassLoginIncomplete = {
                availableAccounts: dto.message,
            };
            await this.presenter.presentIncomplete(incompleteModel);
            return;
        }
        let error_type: 'AUTH_SERVER_CONFIGURATION_ERROR' | 'AUTH_SERVER_SIDE_ERROR' | 'INVALID_CREDENTIALS' | 'UNKNOWN_ERROR';
        switch (dto.statusCode) {
            case 500:
                error_type = 'AUTH_SERVER_SIDE_ERROR';
                break;
            case 502:
                error_type = 'AUTH_SERVER_SIDE_ERROR';
                break;
            case 503:
                error_type = 'AUTH_SERVER_CONFIGURATION_ERROR';
                break;
            case 401:
                error_type = 'INVALID_CREDENTIALS';
                break;
            default:
                error_type = 'UNKNOWN_ERROR';
                break;
        }
        console.log('[LOGIN FLOW 13b] Error response', {
            type: error_type,
            message: dto.message,
            statusCode: dto.statusCode,
        });

        const errorModel: UserpassLoginError = {
            type: error_type,
            message: dto.message,
        };
        await this.presenter.presentError(errorModel);
        return;
    }
}

export default UserPassLoginUseCase;
