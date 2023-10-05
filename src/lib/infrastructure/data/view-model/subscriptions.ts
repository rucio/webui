import { Subscription, SubscriptionState, SubscriptionRuleStates } from "@/lib/core/entity/rucio";
import { BaseViewModel } from "@/lib/sdk/view-models";

export interface SubscriptionViewModel extends BaseViewModel, Omit<Subscription, 'replication_rules'> {
    replication_rules: string
}

export interface SubscriptionRuleStatesViewModel extends BaseViewModel, SubscriptionRuleStates {}

/**
 * A utility function to retrieve an empty {@link SubscriptionViewModel}.
 * @returns an empty SubscriptionViewModel
 */
export function getEmptySubscriptionViewModel(): SubscriptionViewModel {
    const viewModel: SubscriptionViewModel = {
        status: 'error',
        account: '',
        created_at: '',
        id: '',
        last_processed: '',
        lifetime: '',
        name: '',
        policyid: 0,
        retroactive: false,
        state: SubscriptionState.UNKNOWN,
        updated_at: '',
        filter: '',
        replication_rules: '',
    }
    return viewModel
}

export function generateEmptySubscriptionRuleStatesViewModel(): SubscriptionRuleStatesViewModel {
    const viewModel: SubscriptionRuleStatesViewModel = {
        status: 'error',
        name: '' ,
        state_ok: 0,
        state_replicating: 0,
        state_stuck: 0,
        state_suspended: 0,
        state_waiting_approval: 0,
        state_inject: 0,
    }
    return viewModel
}