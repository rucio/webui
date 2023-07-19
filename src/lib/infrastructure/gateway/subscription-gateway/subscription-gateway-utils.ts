import { SubscriptionDTO } from "@/lib/core/dto/subscription-dto";
import { SubscriptionReplicationRule, SubscriptionState } from "@/lib/core/entity/rucio";

export type TRucioSubscription = {
    id: string;
    name: string;
    filter: string;
    replication_rules: string;
    policyid: number;
    state: string;
    last_processed: string;
    account: string;
    lifetime: string;
    comments: string;
    retroactive: boolean;
    expired_at: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * @param replicationRules A JSON formatted string representing a list of replication rules for a subscription
 * @returns Parsed {@link SubscriptionReplicationRule} objects
 */
export function parseReplicationRules(replicationRules: string): SubscriptionReplicationRule[] {
    const replication_rules = JSON.parse(replicationRules)
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
    return rules;
}

/**
 * @param state represents the state of a subscription as a string
 * @returns SubscriptionState enum value
 */
export function parseSubscriptionState(state: string): SubscriptionState {
    switch(state.toUpperCase()) {
        case 'ACTIVE':
            return SubscriptionState.ACTIVE
        case 'INACTIVE':
            return SubscriptionState.INACTIVE
        case 'NEW':
            return SubscriptionState.NEW
        case 'UPDATED':
            return SubscriptionState.UPDATED
        case 'BROKEN':
            return SubscriptionState.BROKEN
        default:
            return SubscriptionState.UNKNOWN
    }
}

/**
 * Converts the data returned by Rucio Server for a subscription to a {@link SubscriptionDTO} object.
 * @param data The data of type {@link TRucioSubscription} returned by Rucio Server.
 * @param account The account name of the subscription.
 * @returns The corresponding {@link SubscriptionDTO} object.
 */
export function convertToSubscriptionDTO(data: TRucioSubscription, account: string): SubscriptionDTO {
    const state = parseSubscriptionState(data.state)
    const rules = parseReplicationRules(data.replication_rules)
    return {
        status: 'success',
            error: null,
            account: account,
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
}

/**
 * @returns Base {@link SubscriptionDTO} object with all fields set to empty values.
 */
export function getEmptyErrorSubscriptionDTO(status: 'success' | 'error'): SubscriptionDTO {
    return {
        status: status,
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
}