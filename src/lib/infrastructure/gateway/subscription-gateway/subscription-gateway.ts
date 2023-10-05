import { ListSubscriptionsDTO, SubscriptionDTO, SubscriptionRuleStateDTO } from "@/lib/core/dto/subscription-dto";
import SubscriptionGatewayOutputPort from "@/lib/core/port/secondary/subscription-gateway-output-port";
import { BaseStreamableDTO } from "@/lib/sdk/dto";
import { injectable } from "inversify";
import GetSubscriptionByIdEndpoint from "./endpoints/get-subscription-by-id-endpoint";
import GetSubscriptionEndpoint from "./endpoints/get-subscription-endpoint";
import ListSubscriptionRuleStatesEndpoint from "./endpoints/list-subscription-rule-states-endpoint";
import ListSubscriptionsEndpoint from "./endpoints/list-subscriptions-endpoint";

@injectable()
export default class SubscriptionGateway implements SubscriptionGatewayOutputPort {
    
    async get(rucioAuthToken: string, account: string, name: string): Promise<SubscriptionDTO> {
        const endpoint: GetSubscriptionEndpoint = new GetSubscriptionEndpoint(rucioAuthToken, account, name)
        const dto: SubscriptionDTO = await endpoint.fetch()
        return dto
    
    }

    async getById(rucioAuthToken: string, id: string): Promise<SubscriptionDTO> {
        const endpoint: GetSubscriptionByIdEndpoint = new GetSubscriptionByIdEndpoint(rucioAuthToken, id)
        const dto: SubscriptionDTO = await endpoint.fetch()
        return dto
    }

    async listSubscriptionRuleStates(rucioAuthToken: string, account: string): Promise<BaseStreamableDTO> {
        try {
            const endpoint: ListSubscriptionRuleStatesEndpoint = new ListSubscriptionRuleStatesEndpoint(rucioAuthToken, account)
            const errorDTO: BaseStreamableDTO | undefined = await endpoint.fetch()
            if(!errorDTO) {
                return {
                    status: 'success',
                    stream: endpoint
                }
            }
            return errorDTO
        } catch(error) {
            const errorDTO: BaseStreamableDTO = {
                status: 'error',
                errorName: 'Exception occurred while fetching subscription rule states',
                errorType: 'gateway_endpoint_error',
                errorMessage: error?.toString(),
            }
            return Promise.resolve(errorDTO)
        }
    }

    async list(rucioAuthToken: string, account: string): Promise<ListSubscriptionsDTO> {
        try {
            const endpoint: ListSubscriptionsEndpoint = new ListSubscriptionsEndpoint(rucioAuthToken, account)
            const errorDTO: ListSubscriptionsDTO | undefined = await endpoint.fetch()
            if(!errorDTO) {
                return {
                    status: 'success',
                    stream: endpoint
                }
            }
            return errorDTO
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