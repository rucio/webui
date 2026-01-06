'use client';

/**
 * TipsPanelWrapper
 * Connects the TipsPanel to the useTips context
 * Renders at the app root level via providers.tsx
 */

import React from 'react';
import { useTips } from '@/lib/infrastructure/hooks/useTips';
import { TipsPanel } from './TipsPanel';

export const TipsPanelWrapper: React.FC = () => {
    const { isPanelOpen, closePanel, allTips, dismissedTips, dismissTip, resetAllTips } = useTips();

    return (
        <TipsPanel
            open={isPanelOpen}
            onOpenChange={open => {
                if (!open) closePanel();
            }}
            tips={allTips}
            dismissedTips={dismissedTips}
            onDismissTip={dismissTip}
            onResetAllTips={resetAllTips}
        />
    );
};

TipsPanelWrapper.displayName = 'TipsPanelWrapper';
