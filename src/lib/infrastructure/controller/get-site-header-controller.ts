import SiteHeaderInputPort from "@/lib/core/port/primary/site-header-input-port";
import { inject, injectable } from "inversify";
import { IronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import USECASE_FACTORY from "../ioc/ioc-symbols-usecase-factory";

export interface IGetSiteHeaderController {
    handle(session: IronSession, response: NextApiResponse): Promise<void>;
}

@injectable()
class GetSiteHeaderController implements IGetSiteHeaderController {
    private useCase: SiteHeaderInputPort | null = null
    private useCaseFactory: (response: NextApiResponse) => SiteHeaderInputPort
    constructor(
        @inject(USECASE_FACTORY.SITE_HEADER) useCaseFactory: (response: NextApiResponse) => SiteHeaderInputPort,
    ){
        this.useCaseFactory = useCaseFactory;
    }
    async handle(session: IronSession, response: NextApiResponse) {
        this.useCase = this.useCaseFactory(response);
        await this.useCase.generateSiteHeader(session)
    }
}

export default GetSiteHeaderController;