import { injectable } from 'inversify';
import { IronSession } from 'iron-session';
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

    async generateSiteHeader(session: IronSession): Promise<void> {
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

        const homeUrl = `/dashboard`;

        const baseResponseModel: GetSiteHeaderResponse = {
            status: 'success',
            homeUrl: homeUrl,
            activeUser: activeUser,
            availableUsers: allUsers,
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
