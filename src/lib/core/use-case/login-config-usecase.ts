import { injectable } from 'inversify';
import { LoginConfigError, LoginConfigResponse } from '../usecase-models/login-config-usecase-models';
import type { LoginConfigInputPort, LoginConfigOutputPort } from '../port/primary/login-config-ports';
import type EnvConfigGatewayOutputPort from '../port/secondary/env-config-gateway-output-port';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { LoginConfigDTO } from '../dto/login-config-dto';
import { ConfigNotFound, InvalidConfig } from '../exceptions/env-config-exceptions';

@injectable()
class LoginConfigUseCase
    extends BaseSingleEndpointUseCase<void, LoginConfigResponse, LoginConfigError, LoginConfigDTO>
    implements LoginConfigInputPort
{
    constructor(protected presenter: LoginConfigOutputPort, private envConfigGateway: EnvConfigGatewayOutputPort) {
        super(presenter);
        this.envConfigGateway = envConfigGateway;
    }

    validateRequestModel(): LoginConfigError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: void): Promise<LoginConfigDTO> {
        try {
            const config = await Promise.all([
                this.envConfigGateway.x509Enabled(),
                this.envConfigGateway.oidcEnabled(),
                this.envConfigGateway.multiVOEnabled(),
                this.envConfigGateway.voList(),
                this.envConfigGateway.oidcProviders(),
                this.envConfigGateway.rucioAuthHost(),
                this.envConfigGateway.userpassEnabled(),
            ]);
            const responseModel: LoginConfigDTO = {
                status: 'success',
                x509Enabled: config[0],
                oidcEnabled: config[1],
                multiVOEnabled: config[2],
                voList: config[3],
                oidcProviders: config[4],
                rucioAuthHost: config[5],
                userpassEnabled: config[6],
            };
            return responseModel;
        } catch (error) {
            let type = 'UnknownError';
            if (error instanceof ConfigNotFound) {
                type = 'ConfigNotFound';
            } else if (error instanceof InvalidConfig) {
                type = 'InvalidConfig';
            }
            const errorDTO: LoginConfigDTO = {
                status: 'error',
                errorMessage: (error as Error).message,
                errorName: type,
                x509Enabled: false,
                oidcEnabled: false,
                userpassEnabled: false,
                multiVOEnabled: false,
                voList: [],
                oidcProviders: [],
                rucioAuthHost: '',
            };
            return errorDTO;
        }
    }

    handleGatewayError(error: LoginConfigDTO): LoginConfigError {
        if (error.errorName === 'ConfigNotFound') {
            return {
                status: 'error',
                code: error.errorCode ? error.errorCode : 500,
                name: 'ConfigNotFound',
                type: 'ConfigNotFound',
                message: error.errorMessage ? error.errorMessage : 'Configuration not found on the server.',
            };
        } else if (error.errorName === 'InvalidConfig') {
            return {
                status: 'error',
                code: error.errorCode ? error.errorCode : 500,
                name: 'InvalidConfig',
                type: 'InvalidConfig',
                message: error.errorMessage ? error.errorMessage : 'Invalid configuration found on the server.',
            };
        } else {
            return {
                status: 'error',
                code: error.errorCode ? error.errorCode : 500,
                name: 'UnknownError',
                type: 'UnknownError',
                message: 'An unknown error occurred while fetching the configuration of login page from the server.',
            };
        }
    }

    processDTO(dto: LoginConfigDTO): { data: LoginConfigResponse | LoginConfigError; status: 'success' | 'error' } {
        return {
            data: {
                status: 'success',
                x509Enabled: dto.x509Enabled,
                userpassEnabled: dto.userpassEnabled,
                oidcEnabled: dto.oidcEnabled,
                multiVOEnabled: dto.multiVOEnabled,
                voList: dto.voList,
                oidcProviders: dto.oidcProviders,
                rucioAuthHost: dto.rucioAuthHost,
            } as LoginConfigResponse,
            status: 'success',
        };
    }
}

export default LoginConfigUseCase;
