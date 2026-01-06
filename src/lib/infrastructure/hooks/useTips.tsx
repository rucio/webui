'use client';

/**
 * Tips Hook and Context
 * Manages global state for the tips system including dismissed tips,
 * onboarding status, and the global tips panel
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Tip, getTipsForPage, getAutoShowTips, findTipById, sortTipsByPriority, getTipsByCategory, TipCategory } from '../tips/tip-registry';
import { getAllTips } from '../tips/tips-data';
import {
    getDismissedTips,
    dismissTip as storageDismissTip,
    resetAllTips as storageResetAllTips,
    hasSeenOnboarding as storageHasSeenOnboarding,
    markOnboardingSeen,
} from '@/lib/utils/tips-storage';

export interface TipsContextType {
    /** Set of dismissed tip IDs */
    dismissedTips: Set<string>;

    /** Whether the user has completed onboarding */
    hasSeenOnboarding: boolean;

    /** Whether the global tips panel is open */
    isPanelOpen: boolean;

    /** Currently active tip (for auto-show behavior) */
    activeTip: Tip | null;

    /** All available tips */
    allTips: Tip[];

    /** Dismiss a tip by ID */
    dismissTip: (tipId: string) => void;

    /** Reset all dismissed tips and onboarding status */
    resetAllTips: () => void;

    /** Open the global tips panel */
    openPanel: () => void;

    /** Close the global tips panel */
    closePanel: () => void;

    /** Toggle the global tips panel */
    togglePanel: () => void;

    /** Show a specific tip by ID */
    showTip: (tipId: string) => void;

    /** Clear the active tip */
    clearActiveTip: () => void;

    /** Check if a tip is dismissed */
    isTipDismissed: (tipId: string) => boolean;

    /** Get visible (non-dismissed) tips for current page */
    getVisibleTipsForCurrentPage: () => Tip[];

    /** Get tips grouped by category */
    getTipsByCategory: () => Map<TipCategory, Tip[]>;

    /** Get a tip by ID */
    getTipById: (tipId: string) => Tip | undefined;

    /** Mark onboarding as complete */
    completeOnboarding: () => void;
}

const TipsContext = createContext<TipsContextType | undefined>(undefined);

export interface TipsProviderProps {
    children: ReactNode;
}

/**
 * Tips Provider
 * Wraps the app and provides global tips state management
 */
export const TipsProvider: React.FC<TipsProviderProps> = ({ children }) => {
    const pathname = usePathname();
    const [dismissedTips, setDismissedTips] = useState<Set<string>>(new Set());
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true); // Default true to prevent flash
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [activeTip, setActiveTip] = useState<Tip | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const allTips = useMemo(() => getAllTips(), []);

    // Initialize from localStorage on mount
    useEffect(() => {
        const dismissed = getDismissedTips();
        setDismissedTips(new Set(dismissed));
        setHasSeenOnboarding(storageHasSeenOnboarding());
        setIsInitialized(true);
    }, []);

    // Auto-show tips for new users on page navigation
    useEffect(() => {
        if (!isInitialized || hasSeenOnboarding || !pathname) {
            return;
        }

        // Get auto-show tips for current page
        const autoShowTips = getAutoShowTips(allTips, pathname);
        const visibleAutoShowTips = autoShowTips.filter(tip => !dismissedTips.has(tip.id));

        if (visibleAutoShowTips.length > 0) {
            // Show first essential tip after a delay to let the page settle
            const timer = setTimeout(() => {
                setActiveTip(sortTipsByPriority(visibleAutoShowTips)[0]);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [pathname, isInitialized, hasSeenOnboarding, allTips, dismissedTips]);

    const dismissTip = useCallback((tipId: string) => {
        storageDismissTip(tipId);
        setDismissedTips(prev => {
            const next = new Set(prev);
            next.add(tipId);
            return next;
        });

        // Clear active tip if it's being dismissed
        setActiveTip(current => (current?.id === tipId ? null : current));
    }, []);

    const resetAllTips = useCallback(() => {
        storageResetAllTips();
        setDismissedTips(new Set());
        setHasSeenOnboarding(false);
    }, []);

    const openPanel = useCallback(() => {
        setIsPanelOpen(true);
    }, []);

    const closePanel = useCallback(() => {
        setIsPanelOpen(false);
    }, []);

    const togglePanel = useCallback(() => {
        setIsPanelOpen(prev => !prev);
    }, []);

    const showTip = useCallback(
        (tipId: string) => {
            const tip = findTipById(allTips, tipId);
            if (tip) {
                setActiveTip(tip);
            }
        },
        [allTips],
    );

    const clearActiveTip = useCallback(() => {
        setActiveTip(null);
    }, []);

    const isTipDismissed = useCallback(
        (tipId: string) => {
            return dismissedTips.has(tipId);
        },
        [dismissedTips],
    );

    const getVisibleTipsForCurrentPage = useCallback(() => {
        if (!pathname) return [];
        const pageTips = getTipsForPage(allTips, pathname);
        return sortTipsByPriority(pageTips.filter(tip => !dismissedTips.has(tip.id)));
    }, [pathname, allTips, dismissedTips]);

    const getTipsByCategoryMemo = useCallback(() => {
        const visibleTips = allTips.filter(tip => !dismissedTips.has(tip.id));
        return getTipsByCategory(visibleTips);
    }, [allTips, dismissedTips]);

    const getTipById = useCallback(
        (tipId: string) => {
            return findTipById(allTips, tipId);
        },
        [allTips],
    );

    const completeOnboarding = useCallback(() => {
        markOnboardingSeen();
        setHasSeenOnboarding(true);
    }, []);

    const value: TipsContextType = useMemo(
        () => ({
            dismissedTips,
            hasSeenOnboarding,
            isPanelOpen,
            activeTip,
            allTips,
            dismissTip,
            resetAllTips,
            openPanel,
            closePanel,
            togglePanel,
            showTip,
            clearActiveTip,
            isTipDismissed,
            getVisibleTipsForCurrentPage,
            getTipsByCategory: getTipsByCategoryMemo,
            getTipById,
            completeOnboarding,
        }),
        [
            dismissedTips,
            hasSeenOnboarding,
            isPanelOpen,
            activeTip,
            allTips,
            dismissTip,
            resetAllTips,
            openPanel,
            closePanel,
            togglePanel,
            showTip,
            clearActiveTip,
            isTipDismissed,
            getVisibleTipsForCurrentPage,
            getTipsByCategoryMemo,
            getTipById,
            completeOnboarding,
        ],
    );

    return <TipsContext.Provider value={value}>{children}</TipsContext.Provider>;
};

/**
 * Hook to access the tips context
 * @throws Error if used outside of TipsProvider
 */
export const useTips = (): TipsContextType => {
    const context = useContext(TipsContext);

    if (context === undefined) {
        throw new Error('useTips must be used within a TipsProvider');
    }

    return context;
};
