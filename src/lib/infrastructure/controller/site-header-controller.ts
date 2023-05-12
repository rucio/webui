import SiteHeaderInputPort from "@/lib/core/port/primary/site-header-input-port";
import { inject, injectable } from "inversify";
import { IronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import USECASE_FACTORY from "../config/ioc/ioc-symbols-usecase-factory";

export interface ISiteHeaderController {
    handle(session: IronSession, request: NextApiRequest, response: NextApiResponse): void;
}

@injectable()
class SiteHeaderController implements ISiteHeaderController {
    private useCase: SiteHeaderInputPort | null = null
    private useCaseFactory: (session: IronSession, response: NextApiResponse) => SiteHeaderInputPort
    constructor(
        @inject(USECASE_FACTORY.SITE_HEADER) useCaseFactory: (session: IronSession, response: NextApiResponse) => SiteHeaderInputPort,
    ){
        this.useCaseFactory = useCaseFactory;
    }
    handle(session: IronSession, request: NextApiRequest, response: NextApiResponse) {
        this.useCase = this.useCaseFactory(session, response);
        const hostname = request.headers.host || "";
        this.useCase.generateSiteHeader(session, hostname)
    }
}

export default SiteHeaderController;