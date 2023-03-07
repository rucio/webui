import { injectable } from "inversify";
import { SetX509LoginSessionError, SetX509LoginSessionRequest, SetX509LoginSessionResponse } from "../data/set-x509-login-session";
import { VO } from "../entity/auth-models";
import SetX509LoginSessionInputPort from "../port/primary/set-x509-login-session-input-port";
import type SetX509LoginSessionOutputPort from "../port/primary/set-x509-login-session-output-port";
import type EnvConfigGatewayOutputPort from "../port/secondary/env-config-gateway-output-port";

@injectable()
class SetX509LoginSessionUseCase implements SetX509LoginSessionInputPort {
    constructor(
        private presenter: SetX509LoginSessionOutputPort<any>,
        private envConfigGateway: EnvConfigGatewayOutputPort,
    ) {
        this.presenter = presenter;
        this.envConfigGateway = envConfigGateway;
    }

    async execute(requestModel: SetX509LoginSessionRequest): Promise<void> {
        const { rucioAuthToken, rucioAccount, shortVOName, rucioAuthTokenExpires } = requestModel;
        let rucioIdentity = '';
        let vo: VO | undefined;
        try {
            // Reverse engineer from:
            // https://github.com/rucio/rucio/blob/cf8313a107251bbebfdc3d0e7eef236cea805965/lib/rucio/core/authentication.py#L166
            rucioIdentity = rucioAuthToken.split('-')[1]
        } catch (error) {
            const errorModel: SetX509LoginSessionError = {
                type: 'InvalidToken',
                message: `The token ${rucioAuthToken} is invalid. We cannot extract the identity from it.`,
            }
            await this.presenter.presentError(errorModel);
            return;
        }

        const voList: VO[] = await this.envConfigGateway.voList();
        vo = voList.find((vo) => vo.shortName === shortVOName);
        if (!vo) {
            const errorModel: SetX509LoginSessionError = {
                type: 'InvalidVO',
                message: `The VO ${shortVOName} is invalid. It is not in the list of VOs configured for this server.`,
            }
            await this.presenter.presentError(errorModel);
            return;
        }

        const responseModel: SetX509LoginSessionResponse = {
            rucioIdentity: rucioIdentity,
            isLoggedIn: true,
            vo: vo,
            rucioAuthToken: rucioAuthToken,
            rucioAccount: rucioAccount,
            shortVOName: shortVOName,
            rucioAuthTokenExpires: rucioAuthTokenExpires,
        }
        await this.presenter.presentSuccess(responseModel);
    }

}

export default SetX509LoginSessionUseCase;