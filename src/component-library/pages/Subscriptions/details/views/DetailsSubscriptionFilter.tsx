import React from 'react';
import { DetailsSubscriptionView, DetailsSubscriptionProps } from './DetailsSubscriptionView';
import { JSONViewer } from '@/component-library/features/json/JSONViewer';

/**
 * View component for displaying subscription filter JSON.
 * Follows the same pattern as DID details views with tabs.
 */
export const DetailsSubscriptionFilter: DetailsSubscriptionView = ({ meta }: DetailsSubscriptionProps) => {
    return (
        <div className="w-full p-4">
            <JSONViewer value={meta.filter} mode="interactive" expandDepth={2} showCopyButton maxHeight="calc(100vh - 24rem)" />
        </div>
    );
};
