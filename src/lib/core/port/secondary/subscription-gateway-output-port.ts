import { SubscriptionDTO } from "../../dto/subscription-dto";

export default interface SubscriptionGatewayOutputPort {
    /**
     * Makes a GET request to the Rucio Server to retrieve a subscription
     * @param rucioAuthToken A valid rucio auth token
     * @param account The rucio account name
     * @param name The rucio subscription name
     */
    get(rucioAuthToken: string, account: string, name: string): Promise<SubscriptionDTO>
}