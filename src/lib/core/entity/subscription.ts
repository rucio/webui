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

// Type.Optional per property instead of Type.Partial: Partial over this many properties
// exceeds TypeScript 5's instantiation depth limit with typebox 0.28
export const SubscriptionReplicationRules = Type.Array(
    Type.Object({
        account: Type.Optional(Type.String()),
        copies: Type.Optional(Type.Union([Type.Number(), Type.String()])),
        rse_expression: Type.Optional(Type.String()),
        grouping: Type.Optional(Type.Union([Type.Literal('ALL'), Type.Literal('DATASET'), Type.Literal('NONE')])),
        weight: Type.Optional(Type.Number()),
        lifetime: Type.Optional(Type.Number()),
        locked: Type.Optional(Type.Boolean()),
        subscription_id: Type.Optional(Type.String()),
        source_replica_expression: Type.Optional(Type.String()),
        activity: Type.Optional(Type.String()),
        purge_replicas: Type.Optional(Type.Boolean()),
        ignore_availability: Type.Optional(Type.Boolean()),
        comment: Type.Optional(Type.String()),
        delay_injection: Type.Optional(Type.Boolean()),
    }),
);
