import { UserpassLoginError, UserpassLoginResponse } from "@/lib/core/data/userpass-login";
import UserPassLoginOutputPort from "@/lib/core/port/primary/userpass-login-output-port";
import { IronSession } from "iron-session";
import { NextApiResponse } from "next";
import { setEmptySession } from "../auth/session-utils";
import type { AuthViewModel } from "../data/auth/auth";


/**
 * Provides an implementation of the {@link UserPassLoginOutputPort} interface.
 * This implementation is injected into the {@link UserPassLoginUseCase} via the IoC container.
 */
export default class UserPassLoginPresenter implements UserPassLoginOutputPort<NextApiResponse> {
    response: NextApiResponse;
    session: IronSession;

    constructor(session: IronSession, response: NextApiResponse) {
        this.response = response;
        this.session = session;
    }

    async presentSuccess(responseModel: UserpassLoginResponse) {
        const viewModel: AuthViewModel = {
            rucioIdentity: responseModel.rucioIdentity,
            rucioAccount: responseModel.rucioAccount,
            rucioAuthType: 'userpass',
            rucioAuthToken: responseModel.rucioAuthToken,
            status: 'success',
            rucioAuthTokenExpires: responseModel.rucioAuthTokenExpires,
        }

        this.session.user = {
            rucioIdentity: responseModel.rucioIdentity,
            rucioAccount: responseModel.rucioAccount,
            rucioAuthType: 'userpass',
            rucioAuthToken: responseModel.rucioAuthToken,
            rucioOIDCProvider: null,
            isLoggedIn: true,
            rucioAuthTokenExpires: responseModel.rucioAuthTokenExpires,
        }
        
        await this.session.save();

        this.response.status(200).json(viewModel);
    }

    async presentError(error: UserpassLoginError) {
        const viewModel: AuthViewModel = {
            rucioIdentity: '',
            rucioAccount: '',
            rucioAuthType: '',
            rucioAuthToken: '',
            rucioAuthTokenExpires: '',
            status: 'error',
            message: error.message,
            error_cause: error.type,
        }

        await setEmptySession(this.session);
        this.response.status(401).json(viewModel);
    }
}