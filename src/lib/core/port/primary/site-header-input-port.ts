import { IronSession } from "iron-session";

/**
 * Interface that represents a UseCase that will gather information from avilable gateways to help generate the site header.
 */
export default interface SiteHeaderInputPort {
    /**
     * 
     * @param session The unencrypted session object that contains the user information
     */
    generateSiteHeader(session: IronSession): Promise<void>;
}