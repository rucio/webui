import { injectable } from "inversify";
import { ConfigNotFound, InvalidConfig } from "../data/env-config-exceptions";
import { LoginConfigResponse } from "../data/login-config";
import type LoginConfigInputPort from "../port/primary/login-config-input-port";
import type LoginConfigOutputPort from "../port/primary/login-config-output-port";
import type EnvConfigGatewayOutputPort from "../port/secondary/env-config-gateway-output-port";


@injectable()
class LoginConfigUseCase implements LoginConfigInputPort {

    constructor(
        private presenter: LoginConfigOutputPort<any>,
        private envConfigGateway: EnvConfigGatewayOutputPort,
    ) {
        this.presenter = presenter;
        this.envConfigGateway = envConfigGateway;
    }
    async execute(): Promise<void> {
        try {
            const config = await Promise.all([
                this.envConfigGateway.x509Enabled(),
                this.envConfigGateway.oidcEnabled(),
                this.envConfigGateway.multiVOEnabled(),
                this.envConfigGateway.voList(),
                this.envConfigGateway.oidcProviders(),
                this.envConfigGateway.rucioAuthHost(),
            ])
            const responseModel: LoginConfigResponse = {
                x509Enabled: config[0],
                oidcEnabled: config[1],
                multiVOEnabled: config[2],
                voList: config[3],
                oidcProviders: config[4],
                rucioAuthHost: config[5],
            }
            await this.presenter.presentSuccess(responseModel)
            return
        } catch (error) {
            if (error instanceof ConfigNotFound) {
                await this.presenter.presentError({
                    type: 'ConfigNotFound',
                    message: error.message,
                })
            }
            else if (error instanceof InvalidConfig) {
                await this.presenter.presentError({
                    type: 'InvalidConfig',
                    message: error.message,
                })
            }
            else {
                await this.presenter.presentError({
                    type: 'UnknownError',
                    message: 'An unknown error occurred while fetching the configuration of login page from the server.',
                })
            }
            return
        }
    }

}

export default LoginConfigUseCase;