import { HTTPRequest } from "@/lib/common/http";
import { SubscriptionDTO } from "@/lib/core/dto/subscription-dto";
import { BaseEndpoint } from "@/lib/sdk/gateway-endpoints";
import { BaseHttpErrorTypes } from "@/lib/sdk/http";
import { Response } from "node-fetch";
import { convertToSubscriptionDTO, getEmptySubscriptionDTO as getEmptySubscriptionDTO, TRucioSubscription } from "../subscription-gateway-utils";

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
    async reportErrors(statusCode: number, response: Response): Promise<SubscriptionDTO | undefined> {
        const dto: SubscriptionDTO = getEmptySubscriptionDTO('error')
        dto.errorCode = statusCode
        dto.errorType = 'gateway_endpoint_error'
        let message = ''
        try {
            message = await response.json()
        }catch(e) {
            // do nothing
        }
        
        dto.errorMessage = message
        switch(statusCode) {
            case 404:
                dto.errorName = 'Subscription not found'
                break;
            case 406:
                dto.errorName = "Not Acceptable"
            default:
                dto.errorName = BaseHttpErrorTypes.UNKNOWN_ERROR.errorName
        }
        return Promise.resolve(dto)
    }
    
    createDTO(data: any): SubscriptionDTO {
        data = data as TRucioSubscription
        const dto = convertToSubscriptionDTO(data, this.account)
        return dto
    }
}