import { Type } from '@sinclair/typebox';

const singleOrArray = () => Type.Union([Type.String(), Type.Array(Type.String())]);

export const SubscriptionFilter = Type.Partial(
    Type.Object({
        pattern: Type.String(),
        excluded_pattern: Type.String(),
        split_rule: Type.Boolean(),
        scope: Type.Array(Type.String()),
        account: singleOrArray(),
        did_type: singleOrArray(),
        min_avg_file_size: Type.Number(),
        max_avg_file_size: Type.Number(),
    }),
);

export const SubscriptionReplicationRules = Type.Array(
    Type.Partial(
        Type.Object({
            account: Type.String(),
            copies: Type.Union([Type.Number(), Type.String()]),
            rse_expression: Type.String(),
            grouping: Type.Union([Type.Literal('ALL'), Type.Literal('DATASET'), Type.Literal('NONE')]),
            weight: Type.Number(),
            lifetime: Type.Number(),
            locked: Type.Boolean(),
            subscription_id: Type.String(),
            source_replica_expression: Type.String(),
            activity: Type.String(),
            purge_replicas: Type.Boolean(),
            ignore_availability: Type.Boolean(),
            comment: Type.String(),
            delay_injection: Type.Boolean(),
        }),
    ),
);
