import { SetX509LoginSessionRequest } from '@/lib/core/usecase-models/set-x509-login-session-usecase-models';
import SetX509LoginSessionInputPort from '@/lib/core/port/primary/set-x509-login-session-input-port';
import { inject, injectable } from 'inversify';
import { RucioSession } from '../auth/session';
import { Signal } from '@/lib/sdk/web';
import USECASE_FACTORY from '../ioc/ioc-symbols-usecase-factory';

export interface ISetX509LoginSessionController {
    handle(
        session: RucioSession,
        response: Signal,
        rucioAuthToken: string,
        rucioAccount: string,
        shortVOName: string,
        rucioTokenExpiry: string,
    ): void;
}

@injectable()
class SetX509LoginSessionController implements ISetX509LoginSessionController {
    private usecCase: SetX509LoginSessionInputPort | null = null;
    private useCaseFactory: (session: RucioSession, response: Signal) => SetX509LoginSessionInputPort;

    constructor(
        @inject(USECASE_FACTORY.SET_X509_LOGIN_SESSION)
        useCaseFactory: (session: RucioSession, response: Signal) => SetX509LoginSessionInputPort,
    ) {
        this.useCaseFactory = useCaseFactory;
    }
    async handle(
        session: RucioSession,
        response: Signal,
        rucioAuthToken: string,
        rucioAccount: string,
        shortVOName: string,
        rucioTokenExpiry: string,
    ) {
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
