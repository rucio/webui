import { LoginConfigError, LoginConfigResponse } from "@/lib/core/data/login-config";
import LoginConfigOutputPort from "@/lib/core/port/primary/login-config-output-port";
import { IronSession } from "iron-session";
import { NextApiResponse } from "next";
import { LoginViewModel } from "@/lib/infrastructure/data/view-model/login";

export default class LoginConfigPresenter implements LoginConfigOutputPort<NextApiResponse> {
    response: NextApiResponse;
    session: IronSession;

    constructor(session: IronSession, response: NextApiResponse) {
        this.response = response;
        this.session = session;
    }

    async presentSuccess(responseModel: LoginConfigResponse) {
        const user = this.session.user;
        let loggedIn = false;
        if (user) {
            loggedIn = user.isLoggedIn;
        }
        const viewModel: LoginViewModel = {
            status: 'success',
            x509Enabled: responseModel.x509Enabled,
            oidcEnabled: responseModel.oidcEnabled,
            multiVOEnabled: responseModel.multiVOEnabled,
            voList: responseModel.voList,
            oidcProviders: responseModel.oidcProviders,
            isLoggedIn: loggedIn,
        }
        this.response.status(200).json(responseModel);
    }

    async presentError(error: LoginConfigError) {
        const viewModel: LoginViewModel = {
            status: 'error',
            x509Enabled: false,
            oidcEnabled: false,
            multiVOEnabled: false,
            voList: [],
            oidcProviders: [],
            isLoggedIn: false,
            message: error.message,
        }
        
        this.response.status(500).json(error);
    }
}