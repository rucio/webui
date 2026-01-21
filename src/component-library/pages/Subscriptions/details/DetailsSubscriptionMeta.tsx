import React from 'react';
import { Divider } from '@/component-library/atoms/misc/Divider';
import { KeyValueRow } from '@/component-library/features/key-value/KeyValueRow';
import { Field } from '@/component-library/atoms/misc/Field';
import { formatDate } from '@/component-library/features/utils/text-formatters';
import { KeyValueWrapper } from '@/component-library/features/key-value/KeyValueWrapper';
import { Checkbox } from '@/component-library/atoms/form/checkbox';
import { SubscriptionViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { SubscriptionStateBadge } from '@/component-library/features/badges/Subscription/SubscriptionStateBadge';
import { NullBadge } from '@/component-library/features/badges/NullBadge';

/**
 * A responsive divider component for subscription sections.
 *
 * Renders horizontal divider on mobile/tablet (< lg), vertical divider on large screens (lg+).
 * This pattern matches the DID details implementation for consistent responsive behavior.
 */
const SubscriptionSectionDivider = () => (
    <>
        {/* Horizontal divider for mobile/tablet */}
        <div className="w-full lg:hidden">
            <Divider />
        </div>
        {/* Vertical divider for lg and above */}
        <div className="hidden lg:block h-auto">
            <Divider orientation="vertical" spacing="md" />
        </div>
    </>
);

export const DetailsSubscriptionMeta = ({ meta }: { meta: SubscriptionViewModel }) => {
    const getLifetimeField = () => {
        if (meta.lifetime && meta.lifetime !== '') {
            return <Field>{meta.lifetime}</Field>;
        }
        return <NullBadge />;
    };

    const getLastProcessedField = () => {
        if (meta.last_processed && meta.last_processed !== '') {
            return <Field>{formatDate(meta.last_processed)}</Field>;
        }
        return <NullBadge />;
    };

    return (
        <div className="w-full">
            {/* Multi-column metadata display with responsive dividers */}
            <KeyValueWrapper className="flex 2xl:flex-row flex-col p-6">
                <div className="flex lg:flex-row flex-col lg:justify-between grow">
                    <div className="flex flex-col">
                        <KeyValueRow name="Name">
                            <Field>{meta.name}</Field>
                        </KeyValueRow>
                        <KeyValueRow name="Account">
                            <Field>{meta.account}</Field>
                        </KeyValueRow>
                        <KeyValueRow name="State">
                            <SubscriptionStateBadge value={meta.state} />
                        </KeyValueRow>
                        <KeyValueRow name="ID">
                            <Field className="font-mono text-sm">{meta.id}</Field>
                        </KeyValueRow>
                    </div>
                    <SubscriptionSectionDivider />
                    <div className="flex flex-col">
                        <KeyValueRow name="Created At">
                            <Field>{formatDate(meta.created_at)}</Field>
                        </KeyValueRow>
                        <KeyValueRow name="Updated At">
                            <Field>{formatDate(meta.updated_at)}</Field>
                        </KeyValueRow>
                        <KeyValueRow name="Last Processed">{getLastProcessedField()}</KeyValueRow>
                        <KeyValueRow name="Lifetime">{getLifetimeField()}</KeyValueRow>
                    </div>
                    <SubscriptionSectionDivider />
                    <div className="flex flex-col">
                        <KeyValueRow name="Policy ID">
                            <Field>{meta.policyid}</Field>
                        </KeyValueRow>
                        <KeyValueRow name="Retroactive">
                            <Checkbox checked={meta.retroactive} disabled />
                        </KeyValueRow>
                    </div>
                </div>
            </KeyValueWrapper>
        </div>
    );
};
