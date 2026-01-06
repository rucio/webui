/**
 * Local storage utility for tracking tip dismissal state
 * Stores dismissed tips and onboarding status for the tips feature
 */

const STORAGE_KEY = 'rucio_tips_state';
const STORAGE_VERSION = 1;

export interface TipsStorageState {
    dismissedTipIds: string[];
    hasSeenOnboarding: boolean;
    lastResetTimestamp: string | null;
    version: number;
}

/**
 * Check if code is running in browser environment
 */
function isBrowser(): boolean {
    return typeof window !== 'undefined';
}

/**
 * Get the default storage state
 */
function getDefaultState(): TipsStorageState {
    return {
        dismissedTipIds: [],
        hasSeenOnboarding: false,
        lastResetTimestamp: null,
        version: STORAGE_VERSION,
    };
}

/**
 * Get the current tips state from localStorage
 */
export function getTipsState(): TipsStorageState {
    if (!isBrowser()) {
        return getDefaultState();
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return getDefaultState();
        }

        const state: TipsStorageState = JSON.parse(stored);

        // Handle version migration if needed
        if (state.version !== STORAGE_VERSION) {
            // For now, just reset to default on version mismatch
            return getDefaultState();
        }

        return state;
    } catch (error) {
        console.error('Failed to get tips state:', error);
        return getDefaultState();
    }
}

/**
 * Save the tips state to localStorage
 */
function saveTipsState(state: TipsStorageState): void {
    if (!isBrowser()) {
        return;
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error('Failed to save tips state:', error);
    }
}

/**
 * Get list of dismissed tip IDs
 */
export function getDismissedTips(): string[] {
    return getTipsState().dismissedTipIds;
}

/**
 * Check if a specific tip has been dismissed
 */
export function isTipDismissed(tipId: string): boolean {
    return getTipsState().dismissedTipIds.includes(tipId);
}

/**
 * Dismiss a tip by ID
 */
export function dismissTip(tipId: string): void {
    const state = getTipsState();

    if (!state.dismissedTipIds.includes(tipId)) {
        state.dismissedTipIds.push(tipId);
        saveTipsState(state);
    }
}

/**
 * Reset all dismissed tips
 */
export function resetAllTips(): void {
    const state = getTipsState();
    state.dismissedTipIds = [];
    state.hasSeenOnboarding = false;
    state.lastResetTimestamp = new Date().toISOString();
    saveTipsState(state);
}

/**
 * Check if user has seen the onboarding tips
 */
export function hasSeenOnboarding(): boolean {
    return getTipsState().hasSeenOnboarding;
}

/**
 * Mark onboarding as seen
 */
export function markOnboardingSeen(): void {
    const state = getTipsState();
    state.hasSeenOnboarding = true;
    saveTipsState(state);
}

/**
 * Get the timestamp of the last reset (if any)
 */
export function getLastResetTimestamp(): string | null {
    return getTipsState().lastResetTimestamp;
}
