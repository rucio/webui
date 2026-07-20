'use client';

import React from 'react';
import { FeatureKey } from '@/lib/core/entity/feature-config';
import { useFeature } from '@/component-library/features/feature-flags/FeatureProvider';

export function FeatureGate({ feature, fallback = null, children }: { feature: FeatureKey; fallback?: React.ReactNode; children: React.ReactNode }) {
    const enabled = useFeature(feature);
    return <>{enabled ? children : fallback}</>;
}
