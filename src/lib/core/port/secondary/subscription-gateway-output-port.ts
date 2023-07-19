import { ListSubscriptionsDTO, SubscriptionDTO } from "../../dto/subscription-dto";

export default interface SubscriptionGatewayOutputPort {
    /**
     * Makes a GET request to the Rucio Server to retrieve a subscription
     * @param rucioAuthToken A valid rucio auth token
     * @param account The rucio account name
     * @param name The rucio subscription name
     */
    get(rucioAuthToken: string, account: string, name: string): Promise<SubscriptionDTO>

    /**
     * Lists all subscriptions for a given account in an NDJSON stream
     * @param rucioAuthToken A valid rucio auth token
     * @param account The rucio account name for which the subscriptions should be listed
     */
    list(rucioAuthToken: string, account: string): Promise<ListSubscriptionsDTO>
}