import { SetX509LoginSessionRequest } from "@/lib/core/data/set-x509-login-session";
import SetX509LoginSessionInputPort from "@/lib/core/port/primary/set-x509-login-session-input-port";
import { inject, injectable } from "inversify";
import { IronSession } from "iron-session";
import { NextApiResponse } from "next";
import USECASE_FACTORY from "../config/ioc/ioc-symbols-usecase-factory";

export interface ISetX509LoginSessionController {
    handle(session: IronSession, response: NextApiResponse, rucioAuthToken: string, rucioAccount: string, shortVOName: string, rucioTokenExpiry: string): void;
}

@injectable()
class SetX509LoginSessionController implements ISetX509LoginSessionController {
    private usecCase: SetX509LoginSessionInputPort | null = null;
    private useCaseFactory: (session: IronSession, response: NextApiResponse) => SetX509LoginSessionInputPort;
    
    constructor(
        @inject(USECASE_FACTORY.SET_X509_LOGIN_SESSION) useCaseFactory: (session: IronSession, response: NextApiResponse) => SetX509LoginSessionInputPort,
    ){
        this.useCaseFactory = useCaseFactory;
    }
    async handle(session: IronSession, response: NextApiResponse, rucioAuthToken: string, rucioAccount: string, shortVOName: string, rucioTokenExpiry: string) {
        this.usecCase = this.useCaseFactory(session, response);
        await this.usecCase.execute({
            rucioAuthToken: rucioAuthToken,
            rucioAccount: rucioAccount,
            shortVOName: shortVOName,
            rucioAuthTokenExpires: rucioTokenExpiry,
        } as SetX509LoginSessionRequest);   
    }
}

export default SetX509LoginSessionController;