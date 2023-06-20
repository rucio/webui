import { SwitchAccountRequest } from "@/lib/core/usecase-models/switch-account-usecase-models";
import { AuthType } from "@/lib/core/entity/auth-models";
import type SwitchAccountInputPort from "@/lib/core/port/primary/switch-account-input-port";
import { inject, injectable } from "inversify";
import { IronSession } from "iron-session";
import { NextApiResponse } from "next";
import USECASE_FACTORY from "../ioc/ioc-symbols-usecase-factory";

export interface ISwitchAccountController {
    handle(session: IronSession, response: NextApiResponse, rucioIdentity: string, rucioAccount: string, rucioAuthType: AuthType, redirectTo: string): Promise<void>;
}


@injectable()
class SwitchAccountController implements ISwitchAccountController {
    constructor(
        @inject(USECASE_FACTORY.SWITCH_ACCOUNT) private useCaseFactory: (response: NextApiResponse) => SwitchAccountInputPort,
    ){
        this.useCaseFactory = useCaseFactory;
    }
    
    async handle(session: IronSession, response: NextApiResponse, rucioIdentity: string, rucioAccount: string, rucioAuthType: AuthType, redirectTo: string) {
        const switchAccountUseCase: SwitchAccountInputPort = this.useCaseFactory(response);
        const switchAccountRequest: SwitchAccountRequest = {
            rucioIdentity: rucioIdentity,
            rucioAccount: rucioAccount,
            rucioAuthType: rucioAuthType,
        }

        redirectTo? switchAccountRequest.redirectTo = redirectTo : null;

        await switchAccountUseCase.switchAccount(switchAccountRequest, session);
    }
}

export default SwitchAccountController;