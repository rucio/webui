import { UserpassLoginError, UserpassLoginIncomplete, UserpassLoginResponse } from '@/lib/core/usecase-models/userpass-login-usecase-models';
import { AuthType, Role, SessionUser } from '@/lib/core/entity/auth-models';
import UserPassLoginOutputPort from '@/lib/core/port/primary/userpass-login-output-port';
import { NextApiResponse } from 'next';
import { RucioSession } from '../auth/session';
import { setActiveSessionUser } from '../auth/session-utils';
import type { AuthViewModel } from '../data/auth/auth';

/**
 * Provides an implementation of the {@link UserPassLoginOutputPort} interface.
 * This implementation is injected into the {@link UserPassLoginUseCase} via the IoC container.
 */
export default class UserPassLoginPresenter implements UserPassLoginOutputPort<NextApiResponse> {
    response: NextApiResponse;
    session: RucioSession;

    constructor(session: RucioSession, response: NextApiResponse) {
        this.response = response;
        this.session = session;
    }

    async presentSuccess(responseModel: UserpassLoginResponse) {
        const viewModel: AuthViewModel = {
            rucioIdentity: responseModel.rucioIdentity,
            rucioAccount: responseModel.rucioAccount,
            rucioAuthType: AuthType.USERPASS,
            rucioAuthToken: responseModel.rucioAuthToken,
            status: 'success',
            role: Role.USER,
            rucioAuthTokenExpires: responseModel.rucioAuthTokenExpires,
        };

        const role = responseModel.role;
        if (role) {
            viewModel.role = role;
        } else {
            viewModel.role = Role.USER;
        }

        const sessionUser: SessionUser = {
            rucioIdentity: responseModel.rucioIdentity,
            rucioAccount: responseModel.rucioAccount,
            rucioAuthType: AuthType.USERPASS,
            rucioAuthToken: responseModel.rucioAuthToken,
            rucioOIDCProvider: null,
            rucioVO: responseModel.vo,
            role: viewModel.role || Role.USER,
            isLoggedIn: true,
            rucioAuthTokenExpires: responseModel.rucioAuthTokenExpires,
        };

        if (responseModel.country) {
            viewModel.country = responseModel.country;
            sessionUser.country = responseModel.country;
        }
        if (responseModel.countryRole) {
            viewModel.countryRole = responseModel.countryRole;
            sessionUser.countryRole = responseModel.countryRole;
        }

        setActiveSessionUser(this.session, sessionUser);
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
            role: Role.USER,
            message: error.message,
            error_cause: error.type,
        };

        this.response.status(401).json(viewModel);
    }

    async presentIncomplete(incompleteModel: UserpassLoginIncomplete) {
        const viewModel: AuthViewModel = {
            status: 'multiple_accounts',
            message: incompleteModel.availableAccounts,
            role: Role.USER,
            rucioIdentity: '',
            rucioAccount: '',
            rucioAuthType: '',
            rucioAuthToken: '',
            rucioAuthTokenExpires: '',
        };

        this.response.status(206).json(viewModel);
    }
}
