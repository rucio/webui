import { injectable } from "inversify";
import { IronSession } from "iron-session";
import { SiteHeaderResponse } from "../data/site-header-usecase-models";
import type { User } from "../entity/auth-models";
import SiteHeaderInputPort from "../port/primary/site-header-input-port";
import type SiteHeaderOutputPort from "../port/primary/site-header-output-port";
import type EnvConfigGatewayOutputPort from "../port/secondary/env-config-gateway-output-port";


@injectable()
class SiteHeaderUseCase implements SiteHeaderInputPort {
    constructor(
        private presenter: SiteHeaderOutputPort<any>,
        private envConfigGateway: EnvConfigGatewayOutputPort,
    ) {
        this.presenter = presenter;
        this.envConfigGateway = envConfigGateway;
    }

    async generateSiteHeader(session: IronSession, host: string): Promise<void> {
        let projectURL: string | undefined;
        
        let activeUser: User | undefined;

        let allUsers: User[] = [];

        try {
            projectURL = await this.envConfigGateway.projectURL(); 
        } catch (error) {
            projectURL = undefined;
        }

        if(!session.user) {
            activeUser = undefined;
        } else {
            activeUser = {
                rucioIdentity: session.user.rucioIdentity,
                rucioAccount: session.user.rucioAccount,
                rucioVO: session.user.rucioVO,
                role: session.user.role,
            }
        }

        if(session.allUsers) {
            session.allUsers.forEach((user) => {
                allUsers.push({
                    rucioIdentity: user.rucioIdentity,
                    rucioAccount: user.rucioAccount,
                    rucioVO: user.rucioVO,
                    role: user.role,
                })
            })
        }

        const hostname = new URL(host).hostname;
        const homeUrl = `https://${hostname}/dashboard`;

        const baseResponseModel: SiteHeaderResponse = {
            homeUrl: homeUrl,
            activeUser: activeUser,
            availableUsers: allUsers,
            projectURL: projectURL,
        }

        if(!activeUser){
            this.presenter.presentError({
                ...baseResponseModel,
                error: 'no-active-user'
            })
        }
        
        if(!projectURL) {
            this.presenter.presentError({
                ...baseResponseModel,
                error: 'project-url-not-found'
            })
        }
        
        this.presenter.presentSuccess(baseResponseModel);
    }
}