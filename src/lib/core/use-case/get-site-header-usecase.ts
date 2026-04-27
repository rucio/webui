import { injectable } from 'inversify';
import { RucioSession } from '@/lib/infrastructure/auth/session';
import { GetSiteHeaderError, GetSiteHeaderRequest, GetSiteHeaderResponse } from '../usecase-models/get-site-header-usecase-models';
import type { User } from '../entity/auth-models';
import type { GetSiteHeaderInputPort, GetSiteHeaderOutputPort } from '../port/primary/get-site-header-ports';
import type EnvConfigGatewayOutputPort from '../port/secondary/env-config-gateway-output-port';
import { BaseUseCase } from '@/lib/sdk/usecase';

@injectable()
class GetSiteHeaderUseCase extends BaseUseCase<GetSiteHeaderRequest, GetSiteHeaderResponse, GetSiteHeaderError> implements GetSiteHeaderInputPort {
    constructor(protected readonly presenter: GetSiteHeaderOutputPort, private readonly envConfigGateway: EnvConfigGatewayOutputPort) {
        super(presenter);
        this.presenter = presenter;
        this.envConfigGateway = envConfigGateway;
    }

    async generateSiteHeader(session: RucioSession): Promise<void> {
        let projectURL: string | undefined;

        let activeUser: User | undefined;

        const allUsers: User[] = [];

        try {
            projectURL = await this.envConfigGateway.projectURL();
        } catch (error) {
            projectURL = undefined;
        }

        if (!session.user) {
            activeUser = undefined;
        } else {
            activeUser = {
                rucioIdentity: session.user.rucioIdentity,
                rucioAccount: session.user.rucioAccount,
                rucioVO: session.user.rucioVO,
                role: session.user.role,
                country: session.user.country,
                countryRole: session.user.countryRole,
            };
        }

        if (session.allUsers) {
            session.allUsers.forEach(user => {
                allUsers.push({
                    rucioIdentity: user.rucioIdentity,
                    rucioAccount: user.rucioAccount,
                    rucioVO: user.rucioVO,
                    role: user.role,
                    country: user.country,
                    countryRole: user.countryRole,
                });
            });
        }

        // #628: surface accounts the active identity is mapped to but for which
        // we don't currently hold a live token. The dropdown lists them as
        // "switch (re-auth required)". Authoritative source is the active user's
        // identityAccounts (set by the userpass token adapter from the probe
        // route's listAccountsForIdentity call); we strip out anything already
        // present in availableUsers for the same identity to avoid duplicates.
        const linkedAccountNames: string[] = (() => {
            if (!session.user?.identityAccounts || session.user.identityAccounts.length === 0) return [];
            const livePeers = new Set(
                (session.allUsers ?? [])
                    .filter(u => u.rucioIdentity === session.user!.rucioIdentity && u.rucioAuthType === session.user!.rucioAuthType)
                    .map(u => u.rucioAccount),
            );
            return session.user.identityAccounts.filter(name => !livePeers.has(name));
        })();

        const homeUrl = `/dashboard`;

        const baseResponseModel: GetSiteHeaderResponse = {
            status: 'success',
            homeUrl: homeUrl,
            activeUser: activeUser,
            availableUsers: allUsers,
            linkedAccountNames,
            projectURL: projectURL,
        };

        if (!activeUser) {
            await this.presenter.presentError({
                ...baseResponseModel,
                status: 'error',
                error: 'no-active-user',
                message: 'No active user found',
                name: 'no-active-user',
                code: 418,
            });
            return;
        }

        if (!projectURL) {
            await this.presenter.presentError({
                ...baseResponseModel,
                status: 'error',
                error: 'project-url-not-found',
                message: 'Project URL not found',
                name: 'project-url-not-found',
                code: 500,
            });
            return;
        }

        await this.presenter.presentSuccess(baseResponseModel);
    }

    validateRequestModel(requestModel: GetSiteHeaderRequest): GetSiteHeaderError | undefined {
        return undefined;
    }

    async execute(requestModel: GetSiteHeaderRequest): Promise<void> {
        await this.generateSiteHeader(requestModel.session);
    }
}

export default GetSiteHeaderUseCase;
