import { UserpassLoginError, UserpassLoginResponse } from "@/lib/core/data/userpass-login";
import UserPassLoginOutputPort from "@/lib/core/port/primary/userpass-login-output-port";
import { NextApiResponse } from "next";
import type { AuthViewModel } from "../data/auth/auth";


/**
 * Provides an implementation of the {@link UserPassLoginOutputPort} interface.
 * This implementation is injected into the {@link UserPassLoginUseCase} via the IoC container.
 */
export default class UserPassLoginPresenter implements UserPassLoginOutputPort<NextApiResponse> {
    response: NextApiResponse;

    constructor(response: NextApiResponse) {
        this.response = response;
    }

    presentSuccess(responseModel: UserpassLoginResponse) {
        const viewModel: AuthViewModel = {
            rucioIdentity: responseModel.rucioIdentity,
            rucioAccount: responseModel.rucioAccount,
            rucioAuthType: 'userpass',
            rucioAuthToken: responseModel.rucioAuthToken,
            status: 'success',
        }
        this.response.status(200).json(viewModel);
    }

    presentError(error: UserpassLoginError) {
        const viewModel: AuthViewModel = {
            rucioIdentity: '',
            rucioAccount: '',
            rucioAuthType: '',
            rucioAuthToken: '',
            status: 'error',
            message: error.message,
            error_cause: error.type,
        }
        this.response.status(500).json(viewModel);
    }
}