/**
 * Interface that represents a UseCase that will gather information from avilable gateways to generate the site header.
 */
export default interface SiteHeaderInputPort {
    generateSiteHeader(): Promise<void>;
}