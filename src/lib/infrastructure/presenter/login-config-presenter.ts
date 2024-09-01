import { LoginConfigError, LoginConfigResponse } from '@/lib/core/usecase-models/login-config-usecase-models';
import { LoginConfigOutputPort } from '@/lib/core/port/primary/login-config-ports';
import { IronSession } from 'iron-session';
import { NextApiResponse } from 'next';
import { LoginViewModel } from '@/lib/infrastructure/data/view-model/login';
import { BasePresenter } from '@/lib/sdk/presenter';

export default class LoginConfigPresenter
    extends BasePresenter<LoginConfigResponse, LoginConfigError, LoginViewModel>
    implements LoginConfigOutputPort
{
    constructor(response: NextApiResponse, session?: IronSession) {
        super(response, session);
        if (!this.session) throw new Error('Session not initialized');
    }

    convertResponseModelToViewModel(responseModel: LoginConfigResponse): { viewModel: LoginViewModel; status: number } {
        const user = this.session?.user;
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
            accountActive: user?.rucioAccount,
            accountsAvailable: this.session?.allUsers?.map(user => user.rucioAccount),
            rucioAuthHost: responseModel.rucioAuthHost,
        };
        return { viewModel, status: 200 };
    }

    convertErrorModelToViewModel(errorModel: LoginConfigError): { viewModel: LoginViewModel; status: number } {
        const viewModel: LoginViewModel = {
            status: 'error',
            x509Enabled: true,
            oidcEnabled: false,
            multiVOEnabled: false,
            voList: [],
            oidcProviders: [],
            isLoggedIn: false,
            accountActive: undefined,
            accountsAvailable: undefined,
            message: errorModel.message,
            rucioAuthHost: '',
        };
        return { viewModel, status: 500 };
    }
}
