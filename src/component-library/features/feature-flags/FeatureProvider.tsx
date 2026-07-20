'use client';

import React, { createContext, useContext } from 'react';
import { FeatureKey, FeatureFlagMap } from '@/lib/core/entity/feature-config';

const FeatureContext = createContext<FeatureFlagMap | null>(null);

export function FeatureProvider({ features, children }: { features: FeatureFlagMap; children: React.ReactNode }) {
    return <FeatureContext.Provider value={features}>{children}</FeatureContext.Provider>;
}

/** Returns whether a feature is enabled. Fails safe (disabled) with no provider. */
export function useFeature(key: FeatureKey): boolean {
    const ctx = useContext(FeatureContext);
    if (ctx === null) return false;
    return ctx[key] ?? false;
}
