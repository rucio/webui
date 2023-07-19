import { HTTPRequest } from "@/lib/common/http";
import { SubscriptionDTO } from "@/lib/core/dto/subscription-dto";
import { BaseEndpoint } from "@/lib/sdk/gateway-endpoints";
import { BaseHttpErrorTypes } from "@/lib/sdk/http";
import { Response } from "node-fetch";
import { convertToSubscriptionDTO, getEmptyErrorSubscriptionDTO as getEmptySubscriptionDTO, TRucioSubscription } from "../subscription-gateway-utils";

export default class GetSubscriptionEndpoint extends BaseEndpoint<SubscriptionDTO> {
    
    constructor(
        private readonly rucioAuthToken: string,
        private readonly account: string,
        private readonly name: string,
    ){
        super()
    }

    async initialize(): Promise<void> {
        await super.initialize()
        this.url = `${this.rucioHost}/subscriptions/${this.account}/${this.name}`
        const request: HTTPRequest = {
            method: 'GET',
            url: this.url,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/json',
            },
            body: null,
            params: undefined
        }
        this.request = request
        this.initialized = true
    }
    reportErrors(statusCode: number, response: Response): Promise<SubscriptionDTO | undefined> {
        const dto: SubscriptionDTO = getEmptySubscriptionDTO('error')
        switch(statusCode) {
            case 404:
                dto.error = {
                    errorMessage: 'Subscription not found',
                    errorCode: statusCode
                }
                break;
            case 406:
                dto.error = {
                    errorMessage: 'Not Acceptable',
                    errorCode: statusCode
                }
            default:
                dto.error = BaseHttpErrorTypes.UNKNOWN_ERROR
        }
        return Promise.resolve(dto)
    }
    
    createDTO(data: any): SubscriptionDTO {
        data = data as TRucioSubscription
        const dto = convertToSubscriptionDTO(data, this.account)
        return dto
    }
}