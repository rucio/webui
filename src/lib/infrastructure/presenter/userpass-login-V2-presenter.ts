import { BasePresenter } from '@/lib/sdk/presenter'
import { UserpassLoginV2Error, UserpassLoginV2Response } from '@/lib/core/usecase-models/userpass-login-V2-usecase-models'
import { getEmptyUserpassLoginV2ViewModel, UserpassLoginV2ViewModel } from '@/lib/infrastructure/data/view-model/UserpassloginV2'
import { NextApiResponse } from 'next'
import { UserpassLoginV2OutputPort } from '@/lib/core/port/primary/userpass-login-V2-ports'
import { IronSession } from 'iron-session'
import { AuthType, Role, SessionUser } from '@/lib/core/entity/auth-models'
import { setActiveSessionUser } from '../auth/session-utils'

/**
 * Provides an implementation of the {@link UserpassLoginV2OutputPort} interface.
 * This implementation is injected into the {@link UserpassLoginV2UseCase} via the IoC container.
 */
export default class UserpassLoginV2Presenter
    extends BasePresenter<
        UserpassLoginV2Response,
        UserpassLoginV2Error,
        UserpassLoginV2ViewModel
    >
    implements UserpassLoginV2OutputPort {

    constructor(response: NextApiResponse, session?: IronSession | undefined) {
        super(response, session)
    }

    async processSession(session: IronSession, viewModel: UserpassLoginV2ViewModel, status: number): Promise<void> {
        if (session != undefined && viewModel.sessionUser != undefined) {
            await setActiveSessionUser(session, viewModel.sessionUser)
        }
    }

    convertResponseModelToViewModel(responseModel: UserpassLoginV2Response): {
        viewModel: UserpassLoginV2ViewModel
        status: number
    } {
        const viewModel: UserpassLoginV2ViewModel = {
            rucioIdentity: responseModel.rucioIdentity,
            rucioAccount: responseModel.rucioAccount,
            rucioAuthType: AuthType.USERPASS,
            rucioAuthToken: responseModel.rucioAuthToken,
            status: 'success',
            role: Role.USER,
            rucioAuthTokenExpires: responseModel.rucioAuthTokenExpires,
        }

        const role = responseModel.role
        if (role) {
            viewModel.role = role
        } else {
            viewModel.role = Role.USER
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
        }

        viewModel.sessionUser = sessionUser

        if (responseModel.country) {
            viewModel.country = responseModel.country
            sessionUser.country = responseModel.country
        }
        if (responseModel.countryRole) {
            viewModel.countryRole = responseModel.countryRole
            sessionUser.countryRole = responseModel.countryRole
        }

        return { viewModel, status: 200 }
    }

    convertErrorModelToViewModel(errorModel: UserpassLoginV2Error): {
        viewModel: UserpassLoginV2ViewModel
        status: number
    } {
        const viewModel: UserpassLoginV2ViewModel =
            getEmptyUserpassLoginV2ViewModel()

        if (errorModel.type === 'AUTH_SERVER_CONFIGURATION_ERROR') {
            viewModel.message = "There is a problem with the configuration of the authentication server, please contact support"
            viewModel.error_cause = errorModel.type
            return {
                status: 503,
                viewModel: viewModel,
            }
        }
        else if (errorModel.type === 'AUTH_SERVER_SIDE_ERROR') {
            viewModel.message = 'There is a problem with the authentication server, please contact support'
            viewModel.error_cause = errorModel.type
            return {
                status: 502,
                viewModel: viewModel,
            }
        }
        else if (errorModel.type === 'INVALID_CREDENTIALS') {
            viewModel.message = 'Invalid username, password or account, please check your credentials and try again'
            viewModel.error_cause = errorModel.type
            return {
                status: 401,
                viewModel: viewModel,
            }
        }
        else if (errorModel.type === 'UNKNOWN_ERROR') {
            viewModel.message = 'An unknown error occurred, please try again, if the error persists contact support.'
            viewModel.error_cause = errorModel.type
            return {
                status: 400,
                viewModel: viewModel,
            }
        }
        else if (errorModel.type === 'UNDEFINED_REQUEST_MODEL') {
            viewModel.message = 'The request model is undefined, please contact support'
            viewModel.error_cause = errorModel.type
            return {
                status: 400,
                viewModel: viewModel,
            }
        }

        // gateway errors
        const message = errorModel.message || errorModel.name
        viewModel.message = message
        const errorCode = errorModel.code || 500
        return {
            status: errorCode,
            viewModel: viewModel,
        }
    }
}
