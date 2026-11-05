import { LockState, ReplicaState, RuleState, SubscriptionState } from "./rucio";

export const lockStateString: Record<LockState, string > = {
    [LockState.OK]: 'OK',
    [LockState.REPLICATING]: 'Replicating',
    [LockState.STUCK]: 'Stuck',
    [LockState.UNKNOWN]: 'Unknown',
};

export const replicaStateString: Record<ReplicaState, string> = {
    [ReplicaState.AVAILABLE]: 'Available',
    [ReplicaState.BAD]: 'Bad',
    [ReplicaState.BEING_DELETED]: 'Being Deleted',
    [ReplicaState.COPYING]: 'Copying',
    [ReplicaState.TEMPORARY_UNAVAILABLE]: 'Temporary Unavailable',
    [ReplicaState.UNAVAILABLE]: 'Unavailable',
    [ReplicaState.UNKNOWN]: 'Unknown',
};

export const ruleStateString: Record<RuleState, string> = {
    [RuleState.REPLICATING]: 'Replicating',
    [RuleState.OK]: 'OK',
    [RuleState.STUCK]: 'Stuck',
    [RuleState.SUSPENDED]: 'Suspended',
    [RuleState.WAITING_APPROVAL]: 'Waiting Approval',
    [RuleState.INJECT]: 'Inject',
    [RuleState.UNKNOWN]: 'Unknown',
};

export const subscriptionStateString: Record<SubscriptionState, string> = {
    [SubscriptionState.ACTIVE]: 'Active',
    [SubscriptionState.INACTIVE]: 'Inactive',
    [SubscriptionState.NEW]: 'New',
    [SubscriptionState.UPDATED]: 'Updated',
    [SubscriptionState.BROKEN]: 'Broken',
    [SubscriptionState.UNKNOWN]: 'Unknown',
};
