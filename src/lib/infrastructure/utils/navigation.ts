/**
 * Shared navigation utilities for constructing search URLs
 * Used by SearchBar, CommandPalette, and list pages
 */

export type SearchType = 'did' | 'rse' | 'rule' | 'generic';

export interface DIDSearchParams {
    pattern?: string;
    scope?: string;
    name?: string;
    type?: string;
}

export interface RuleSearchFilters {
    account?: string;
    scope?: string;
    name?: string;
    activity?: string;
    state?: string;
    updatedBefore?: Date;
    updatedAfter?: Date;
}

/**
 * Format a Date object as YYYY-MM-DD for URL parameters
 */
export function formatDateForUrl(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Build URL for DID search with autoSearch=true
 * Supports both pattern-based and scope:name-based searches
 */
export function buildDIDSearchUrl(params: DIDSearchParams = {}): string {
    const urlParams = new URLSearchParams();

    // If we have scope and name, use them directly
    if (params.scope || params.name) {
        urlParams.set('autoSearch', 'true');
        if (params.scope) {
            urlParams.set('scope', params.scope);
        }
        if (params.name) {
            urlParams.set('name', params.name);
        }
        if (params.type) {
            urlParams.set('type', params.type);
        }
    } else if (params.pattern) {
        // Use pattern for simple searches
        urlParams.set('pattern', params.pattern);
        urlParams.set('autoSearch', 'true');
        if (params.type) {
            urlParams.set('type', params.type);
        }
    }

    const queryString = urlParams.toString();
    return queryString ? `/did/list?${queryString}` : '/did/list';
}

/**
 * Build URL for RSE search with autoSearch=true
 */
export function buildRSESearchUrl(expression?: string): string {
    if (!expression || expression.length === 0) {
        return '/rse/list';
    }

    const urlParams = new URLSearchParams();
    urlParams.set('expression', expression);
    urlParams.set('autoSearch', 'true');

    return `/rse/list?${urlParams.toString()}`;
}

/**
 * Build URL for Rule search with autoSearch=true
 */
export function buildRuleSearchUrl(filters: RuleSearchFilters = {}): string {
    const urlParams = new URLSearchParams();

    // Only add autoSearch if we have at least one filter
    const hasFilters =
        filters.account || filters.scope || filters.name || filters.activity || filters.state || filters.updatedBefore || filters.updatedAfter;

    if (!hasFilters) {
        return '/rule/list';
    }

    urlParams.set('autoSearch', 'true');

    if (filters.account) {
        urlParams.set('account', filters.account);
    }
    if (filters.scope) {
        urlParams.set('scope', filters.scope);
    }
    if (filters.name) {
        urlParams.set('name', filters.name);
    }
    if (filters.activity) {
        urlParams.set('activity', filters.activity);
    }
    if (filters.state) {
        urlParams.set('state', filters.state);
    }
    if (filters.updatedBefore) {
        urlParams.set('updated_before', formatDateForUrl(filters.updatedBefore));
    }
    if (filters.updatedAfter) {
        urlParams.set('updated_after', formatDateForUrl(filters.updatedAfter));
    }

    return `/rule/list?${urlParams.toString()}`;
}

/**
 * Build URL for Rule detail page (direct navigation by ID)
 */
export function buildRuleDetailUrl(ruleId: string): string {
    return `/rule/page/${ruleId}`;
}

/**
 * Build URL for Subscription search with autoSearch=true
 */
export function buildSubscriptionSearchUrl(account?: string): string {
    if (!account) {
        return '/subscription/list';
    }

    const urlParams = new URLSearchParams();
    urlParams.set('account', account);
    urlParams.set('autoSearch', 'true');

    return `/subscription/list?${urlParams.toString()}`;
}

/**
 * Detect the type of search query based on patterns
 * Uses same logic as SearchBar for consistency
 */
export function detectSearchType(query: string): SearchType {
    if (!query || query.length === 0) {
        return 'generic';
    }

    // DID pattern: contains ":"
    if (query.includes(':')) {
        return 'did';
    }

    // RSE expression: contains =, |, &, or \
    if (/[=|&\\]/.test(query)) {
        return 'rse';
    }

    // Rule UUID: exactly 32 alphanumeric characters
    if (query.length === 32 && /^[a-zA-Z0-9]+$/.test(query)) {
        return 'rule';
    }

    return 'generic';
}

/**
 * Navigate to a URL using window.location.href
 * This avoids Next.js caching issues and ensures fresh data
 */
export function navigateToSearch(url: string): void {
    window.location.href = url;
}
