import { HTTPRequest } from "@/lib/common/http";
import { SubscriptionDTO } from "@/lib/core/dto/subscription-dto";
import { SubscriptionReplicationRule, SubscriptionState } from "@/lib/core/entity/rucio";
import { BaseEndpoint } from "@/lib/sdk/gateway-endpoints";
import { BaseHttpErrorTypes } from "@/lib/sdk/http";
import { Response } from "node-fetch";

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
        const dto: SubscriptionDTO = {
            status: 'error',
            error: BaseHttpErrorTypes.UNKNOWN_ERROR,
            account: "",
            created_at: "",
            id: "",
            last_processed: "",
            lifetime: "",
            name: "",
            policyid: 0,
            retroactive: false,
            state: SubscriptionState.INACTIVE,
            updated_at: "",
            filter: "",
            replication_rules: [],
        }
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
                break;
        }
        return Promise.resolve(dto)
    }
    
    createDTO(data: any): SubscriptionDTO {
        data = data as {
            id: string;
            name: string;
            filter: string;
            replication_rules: string;
            policyid: number;
            state: SubscriptionState;
            last_processed: string;
            account: string;
            lifetime: string;
            comments: string;
            retroactive: boolean;
            expired_at: string | null;
            created_at: string;
            updated_at: string;
        }

        let state: SubscriptionState
        switch(data.state.toUpperCase()) {
            case 'ACTIVE':
                state = SubscriptionState.ACTIVE
                break;
            case 'INACTIVE':
                state = SubscriptionState.INACTIVE
                break;
            case 'NEW':
                state = SubscriptionState.NEW
                break;
            case 'UPDATED':
                state = SubscriptionState.UPDATED
                break;
            case 'BROKEN':
                state = SubscriptionState.BROKEN
                break;
            default:
                state = SubscriptionState.UNKNOWN
                break;
        }

        const replication_rules = JSON.parse(data.replication_rules)
        const rules: SubscriptionReplicationRule[] = []
        for (const rule of replication_rules) {
            const r: SubscriptionReplicationRule = {
                activity: rule.activity,
                rse_expression: rule.rse_expression,
                source_replica_expression: rule.source_replica_expression,
                copies: rule.copies,
                lifetime: rule.lifetime,
                comments: rule.comments,
            }
            rules.push(r)
        }
        
        const dto: SubscriptionDTO = {
            status: 'success',
            error: null,
            account: this.account,
            created_at: data.created_at,
            id: data.id,
            last_processed: data.last_processed,
            lifetime: data.lifetime,
            name: data.name,
            policyid: data.policyid,
            retroactive: data.retroactive,
            state: state,
            updated_at: data.updated_at,
            filter: data.filter,
            replication_rules: rules,
        }

        return dto
    }
}