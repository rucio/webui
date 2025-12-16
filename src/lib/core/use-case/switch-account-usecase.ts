import { getSessionUserIndex } from '@/lib/infrastructure/auth/session-utils';
import { RucioSession } from '@/lib/infrastructure/auth/session';
import { injectable } from 'inversify';
import { SwitchAccountRequest, SwitchAccountResponse } from '../usecase-models/switch-account-usecase-models';
import { Role, SessionUser } from '../entity/auth-models';
import SwitchAccountInputPort from '../port/primary/switch-account-input-port';
import type SwitchAccountOutputPort from '../port/primary/switch-account-output-port';

@injectable()
export default class SwitchAccountUseCase implements SwitchAccountInputPort {
    constructor(private presenter: SwitchAccountOutputPort<any>) {
        this.presenter = presenter;
    }

    async switchAccount(request: SwitchAccountRequest, session: RucioSession): Promise<void> {
        const { rucioIdentity, rucioAccount, rucioAuthType, redirectTo } = request;
        const redirectUrl = redirectTo ? redirectTo : '/dashboard';

        if (!rucioAuthType) {
            await this.presenter.presentError({
                type: 'invalid_auth_type',
                message: 'Invalid auth type. Must be one of: userpass, x509, oidc',
            });
            return;
        }

        if (!rucioIdentity || !rucioAccount) {
            await this.presenter.presentError({
                type: 'bad request',
                message: 'rucioIdentity and rucioAccount are required',
            });
            return;
        }

        const user: SessionUser = {
            rucioIdentity: rucioIdentity,
            rucioAccount: rucioAccount,
            rucioAuthType: rucioAuthType,
            role: Role.USER, // does not mean anything here
            rucioAuthToken: '', // does not mean anything here
            rucioAuthTokenExpires: '', // does not mean anything here
            rucioOIDCProvider: null, // does not mean anything here
            rucioVO: '', // does not mean anything here
            isLoggedIn: true, // does not mean anything here
        };
        const userIndex = getSessionUserIndex(session, user);
        if (userIndex === -1) {
            await this.presenter.presentError({
                type: 'cannot_switch_account',
                message: 'user not found in session',
            });
            return;
        }

        if (!session.allUsers) {
            await this.presenter.presentError({
                type: 'cannot_switch_account',
                message: 'Could not switch user, as session is in invalid state. This is possibly a bug. Please report to the developers!',
            });
            return;
        }

        session.user = session.allUsers[userIndex];
        await session.save();
        await this.presenter.presentSuccess({
            redirectTo: redirectUrl,
        } as SwitchAccountResponse);
    }
}
