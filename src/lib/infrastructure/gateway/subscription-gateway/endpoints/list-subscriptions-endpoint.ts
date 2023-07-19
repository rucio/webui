import { HTTPRequest } from "@/lib/common/http";
import { ListSubscriptionsDTO, SubscriptionDTO } from "@/lib/core/dto/subscription-dto";
import { BaseStreamableEndpoint } from "@/lib/sdk/gateway-endpoints";
import { Response } from "node-fetch";
import { convertToSubscriptionDTO, TRucioSubscription } from "../subscription-gateway-utils";

/**
 * List subscriptions for an account via Streaming
 */
export default class ListSubscriptionsEndpoint extends BaseStreamableEndpoint<ListSubscriptionsDTO, SubscriptionDTO> {
    
    /**
     * Creates a new instance of the `ListSubscriptionsEndpoint` class.
     * @param rucioAuthToken A valid rucio auth token
     * @param account The account for which to list subscriptions
     */
    constructor(
        private readonly rucioAuthToken: string,
        private readonly account: string,
    ){
        super(true)
    }

    /**
     * @override
     */
    async initialize(): Promise<void> {
        await super.initialize()
        const rucioHost = await this.envConfigGateway.rucioHost()
        const endpoint = `${rucioHost}/subscriptions/${this.account}`
        const request: HTTPRequest = {
            method: 'GET',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/x-json-stream',
            },
            body: null,
            params: undefined
        }
        this.request = request
        this.initialized = true
    }

    async reportErrors(statusCode: number, response: Response): Promise<ListSubscriptionsDTO | undefined> {
        let additionalErrorData: string = ''
        try {
            additionalErrorData = await response.json()
        } catch(error : any) {

        }
        switch(statusCode) {
            case 404:
                return Promise.resolve({
                    status: 'error',
                    error: {
                        errorMessage: 'Subscription or Account not found. ' + additionalErrorData,
                        errorCode: statusCode
                    },
                    stream: null,
                })
            case 406:
                return Promise.resolve({
                    status: 'error',
                    error: {
                        errorMessage: 'Not Acceptable ' + additionalErrorData,
                        errorCode: statusCode
                    },
                    stream: null,
                })
            default:
                return Promise.resolve({
                    status: 'error',
                    error: {
                        errorMessage: `Unknown Error occurred while trying to fetch subscriptions for account ${this.account}. ${additionalErrorData}`,
                        errorCode: statusCode
                    },
                    stream: null,
                })
        }
    }

    /**
     * @implements
     */
    createDTO(response: Buffer): SubscriptionDTO {
        const data: TRucioSubscription = JSON.parse(JSON.parse(response.toString()))
        const dto: SubscriptionDTO = convertToSubscriptionDTO(data, this.account)
        return dto
    }
}