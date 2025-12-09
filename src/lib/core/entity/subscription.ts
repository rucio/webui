/**
 * Subscription filter type for Rucio subscriptions
 */
export type SubscriptionFilter = {
    pattern?: string;
    excluded_pattern?: string;
    split_rule?: boolean;
    scope?: string[];
    account?: string | string[];
    did_type?: string | string[];
    min_avg_file_size?: number;
    max_avg_file_size?: number;
};

/**
 * Subscription replication rule type
 */
export type SubscriptionReplicationRule = {
    account?: string;
    copies?: number | string;
    rse_expression?: string;
    grouping?: 'ALL' | 'DATASET' | 'NONE';
    weight?: number;
    lifetime?: number;
    locked?: boolean;
    subscription_id?: string;
    source_replica_expression?: string;
    activity?: string;
    purge_replicas?: boolean;
    ignore_availability?: boolean;
    comment?: string;
    delay_injection?: boolean;
};

export type SubscriptionReplicationRules = SubscriptionReplicationRule[];
