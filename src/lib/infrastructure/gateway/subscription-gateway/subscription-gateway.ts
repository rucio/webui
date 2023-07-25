import { ListSubscriptionsDTO, SubscriptionDTO } from "@/lib/core/dto/subscription-dto";
import SubscriptionGatewayOutputPort from "@/lib/core/port/secondary/subscription-gateway-output-port";
import { injectable } from "inversify";
import GetSubscriptionEndpoint from "./endpoints/get-subscription-endpoint";
import ListSubscriptionsEndpoint from "./endpoints/list-subscriptions-endpoint";

@injectable()
export default class SubscriptionGateway implements SubscriptionGatewayOutputPort {
    async get(rucioAuthToken: string, account: string, name: string): Promise<SubscriptionDTO> {
        const endpoint: GetSubscriptionEndpoint = new GetSubscriptionEndpoint(rucioAuthToken, account, name)
        const dto: SubscriptionDTO = await endpoint.fetch()
        return dto
    
    }

    async list(rucioAuthToken: string, account: string): Promise<ListSubscriptionsDTO> {
        try {
            const endpoint: ListSubscriptionsEndpoint = new ListSubscriptionsEndpoint(rucioAuthToken, account)
            await endpoint.fetch()
            const dto: ListSubscriptionsDTO = {
                status: 'success',
                stream: endpoint
            }
            return Promise.resolve(dto)
        } catch(error) {
            const errorDTO: ListSubscriptionsDTO = {
                status: 'error',
                errorName: 'Exception occurred while fetching subscriptions',
                errorType: 'gateway_endpoint_error',
                errorMessage: error?.toString(),
            }
            return Promise.resolve(errorDTO)
        }
    }
}