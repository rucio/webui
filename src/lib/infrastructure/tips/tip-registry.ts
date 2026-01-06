/**
 * Tip Registry - Type definitions and utilities for the tips system
 */

import { ComponentType } from 'react';

/**
 * Categories for organizing tips in the global panel
 */
export enum TipCategory {
    GETTING_STARTED = 'getting-started',
    DIDS = 'dids',
    RULES = 'rules',
    RSES = 'rses',
    SUBSCRIPTIONS = 'subscriptions',
    NAVIGATION = 'navigation',
    ADVANCED = 'advanced',
}

/**
 * Human-readable labels for tip categories
 */
export const TipCategoryLabels: Record<TipCategory, string> = {
    [TipCategory.GETTING_STARTED]: 'Getting Started',
    [TipCategory.DIDS]: 'Data Identifiers (DIDs)',
    [TipCategory.RULES]: 'Rules',
    [TipCategory.RSES]: 'Storage Elements (RSEs)',
    [TipCategory.SUBSCRIPTIONS]: 'Subscriptions',
    [TipCategory.NAVIGATION]: 'Navigation',
    [TipCategory.ADVANCED]: 'Advanced',
};

/**
 * Priority levels for tips
 * - essential: Must-know information for basic usage
 * - helpful: Improves user experience but not critical
 * - advanced: Power user features and shortcuts
 */
export type TipPriority = 'essential' | 'helpful' | 'advanced';

/**
 * Visual variants for tips (maps to design system colors)
 */
export type TipVariant = 'info' | 'success' | 'warning';

/**
 * Definition of a single tip
 */
export interface Tip {
    /** Unique identifier for the tip (e.g., 'did-search-scope') */
    id: string;

    /** Short title displayed prominently */
    title: string;

    /** Main tip content (plain text or simple markdown) */
    content: string;

    /** Category for organization in global panel */
    category: TipCategory;

    /** Priority level for sorting and auto-display logic */
    priority: TipPriority;

    /** Page routes where this tip is relevant (e.g., ['/did/list']) */
    pages?: string[];

    /** CSS selector or element ID for positioning contextual tips */
    targetElement?: string;

    /** Visual variant (default: 'info') */
    variant?: TipVariant;

    /** Custom icon component (defaults based on variant if not provided) */
    icon?: ComponentType<{ className?: string }>;

    /** Auto-show for new users on first visit to relevant page */
    showOnFirstVisit?: boolean;

    /** Whether the tip can be dismissed (default: true) */
    dismissible?: boolean;

    /** URL to documentation or learn more content */
    learnMoreUrl?: string;

    /** IDs of related tips to suggest */
    relatedTips?: string[];
}

/**
 * Get tips filtered by page route
 */
export function getTipsForPage(tips: Tip[], pageRoute: string): Tip[] {
    return tips.filter(tip => !tip.pages || tip.pages.some(page => pageRoute.startsWith(page)));
}

/**
 * Get tips grouped by category
 */
export function getTipsByCategory(tips: Tip[]): Map<TipCategory, Tip[]> {
    const grouped = new Map<TipCategory, Tip[]>();

    // Initialize all categories
    Object.values(TipCategory).forEach(category => {
        grouped.set(category, []);
    });

    // Group tips
    tips.forEach(tip => {
        const categoryTips = grouped.get(tip.category) || [];
        categoryTips.push(tip);
        grouped.set(tip.category, categoryTips);
    });

    return grouped;
}

/**
 * Sort tips by priority (essential first, then helpful, then advanced)
 */
export function sortTipsByPriority(tips: Tip[]): Tip[] {
    const priorityOrder: Record<TipPriority, number> = {
        essential: 0,
        helpful: 1,
        advanced: 2,
    };

    return [...tips].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

/**
 * Find a tip by ID
 */
export function findTipById(tips: Tip[], tipId: string): Tip | undefined {
    return tips.find(tip => tip.id === tipId);
}

/**
 * Get essential tips that should auto-show for new users
 */
export function getAutoShowTips(tips: Tip[], pageRoute: string): Tip[] {
    return tips.filter(
        tip => tip.showOnFirstVisit && tip.priority === 'essential' && (!tip.pages || tip.pages.some(page => pageRoute.startsWith(page))),
    );
}
