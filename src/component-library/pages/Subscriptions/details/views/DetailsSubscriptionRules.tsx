import React from 'react';
import { DetailsSubscriptionView, DetailsSubscriptionProps } from './DetailsSubscriptionView';
import { JSONViewer } from '@/component-library/features/json/JSONViewer';

/**
 * View component for displaying subscription replication rules JSON.
 * Follows the same pattern as DID details views with tabs.
 */
export const DetailsSubscriptionRules: DetailsSubscriptionView = ({ meta }: DetailsSubscriptionProps) => {
    return (
        <JSONViewer
            value={meta.replication_rules}
            mode="interactive"
            expandDepth={2}
            showCopyButton
            maxHeight="100%"
            showExpandButton
            expandTitle="Replication Rules"
        />
    );
};
