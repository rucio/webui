import { SetX509LoginSessionError, SetX509LoginSessionResponse } from "@/lib/core/data/set-x509-login-session";
import { SessionUser } from "@/lib/core/entity/auth-models";
import SetX509LoginSessionOutputPort from "@/lib/core/port/primary/set-x509-login-session-output-port";
import { IronSession } from "iron-session";
import { NextApiResponse } from "next";
import { setActiveSessionUser, setEmptySession } from "../auth/session-utils";
import { AuthViewModel } from "../data/auth/auth";

export default class SetX509LoginSessionPresenter implements SetX509LoginSessionOutputPort<NextApiResponse> {
    response: NextApiResponse;
    session: IronSession;

    constructor(session: IronSession, res: NextApiResponse) {
        this.response = res;
        this.session = session;
    }
    
    async presentSuccess(responseModel: SetX509LoginSessionResponse) {
        const sessionUser: SessionUser = {
            isLoggedIn: true,
            rucioAuthToken: responseModel.rucioAuthToken,
            rucioAuthTokenExpires: responseModel.rucioAuthTokenExpires,
            rucioIdentity: responseModel.rucioIdentity,
            rucioAuthType: 'x509',
            rucioVO: responseModel.shortVOName,
            rucioAccount: responseModel.rucioAccount,
            rucioOIDCProvider: '',
        }
        await setActiveSessionUser(this.session, sessionUser);

        const viewModel: AuthViewModel = {
            status: 'success',
            rucioAccount: responseModel.rucioAccount,
            rucioAuthType: 'x509',
            rucioAuthToken: responseModel.rucioAuthToken,
            rucioAuthTokenExpires: responseModel.rucioAuthTokenExpires,
            rucioIdentity: responseModel.rucioIdentity,
        }
        this.response.status(200).json(viewModel);
        return;
    }

    async presentError(errorModel: SetX509LoginSessionError) {
        const viewModel: AuthViewModel = {
            rucioIdentity: '',
            rucioAccount: '',
            rucioAuthType: '',
            rucioAuthToken: '',
            rucioAuthTokenExpires: '',
            status: 'error',
            message: errorModel.message,
            error_cause: errorModel.type,
        }

        await setEmptySession(this.session);
        this.response.status(500).json(viewModel);
        return;
    }
    
}