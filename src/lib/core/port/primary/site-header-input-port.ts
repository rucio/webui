import { IronSession } from "iron-session";

/**
 * Interface that represents a UseCase that will gather information from avilable gateways to help generate the site header.
 */
export default interface SiteHeaderInputPort {
    generateSiteHeader(session: IronSession): Promise<void>;
}