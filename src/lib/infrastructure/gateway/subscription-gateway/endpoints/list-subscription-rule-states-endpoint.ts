import { HTTPRequest } from '@/lib/sdk/http';
import { BaseEndpoint, BaseStreamableEndpoint } from '@/lib/sdk/gateway-endpoints';
import { Response } from 'node-fetch';
import {
    convertToSubscriptionRuleStatesDTO,
    getEmptySubscriptionRuleStatesDTO,
    TRucioSubscription,
    TRucioSubscriptionRuleStates,
} from '../subscription-gateway-utils';
import { SubscriptionRuleStateDTO } from '@/lib/core/dto/subscription-dto';
import { BaseStreamableDTO } from '@/lib/sdk/dto';

/**
 * List subscriptions for an account via Streaming
 */
export default class ListSubscriptionRuleStatesEndpoint extends BaseStreamableEndpoint<BaseStreamableDTO, SubscriptionRuleStateDTO> {
    /**
     * Creates a new instance of the `ListSubscriptionRuleStatesEndpoint` class.
     * @param rucioAuthToken A valid rucio auth token
     * @param account The account for which to list subscriptions
     */
    constructor(private readonly rucioAuthToken: string, private readonly account: string) {
        super();
    }

    /**
     * @override
     */
    async initialize(): Promise<void> {
        await super.initialize();
        const rucioHost = await this.envConfigGateway.rucioHost();
        // TODO: bug in rucio. subscription name does not matter
        const endpoint = `${rucioHost}/subscriptions/${this.account}/doesntmatter/Rules/States`;
        const request: HTTPRequest = {
            method: 'GET',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/x-json-stream',
            },
            body: null,
            params: undefined,
        };
        this.request = request;
        this.initialized = true;
    }

    async reportErrors(statusCode: number, response: Response): Promise<SubscriptionRuleStateDTO | undefined> {
        const dto: SubscriptionRuleStateDTO = getEmptySubscriptionRuleStatesDTO();
        let additionalErrorData: string = '';
        try {
            additionalErrorData = await response.json();
            dto.errorMessage = additionalErrorData;
        } catch (error: any) {}
        dto.errorCode = statusCode;
        switch (statusCode) {
            case 404:
                dto.errorName = 'Subscription not found';
                break;
            case 406:
                dto.errorName = 'Not Acceptable';
                break;
            default:
                dto.errorName = 'Unknown Error';
                break;
        }
        return Promise.resolve(dto);
    }

    /**
     * @implements
     */
    createDTO(response: any): SubscriptionRuleStateDTO {
        const data: TRucioSubscriptionRuleStates = JSON.parse(JSON.parse(response)) as TRucioSubscriptionRuleStates;
        const dto: SubscriptionRuleStateDTO = convertToSubscriptionRuleStatesDTO(data);
        return dto;
    }
}
