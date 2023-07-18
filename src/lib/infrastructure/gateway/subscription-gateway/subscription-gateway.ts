import { SubscriptionDTO } from "@/lib/core/dto/subscription-dto";
import SubscriptionGatewayOutputPort from "@/lib/core/port/secondary/subscription-gateway-output-port";
import { injectable } from "inversify";
import GetSubscriptionEndpoint from "./endpoints/get-subscription-endpoint";

@injectable()
export default class SubscriptionGateway implements SubscriptionGatewayOutputPort {
    async get(rucioAuthToken: string, account: string, name: string): Promise<SubscriptionDTO> {
        const endpoint: GetSubscriptionEndpoint = new GetSubscriptionEndpoint(rucioAuthToken, account, name)
        const dto: SubscriptionDTO = await endpoint.fetch()
        return dto
    }
}