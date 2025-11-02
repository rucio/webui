/**
 * Local storage utility for tracking recently visited pages
 * Stores up to 10 recent pages for command palette "Recent" section
 */

export interface RecentPage {
    url: string;
    title: string;
    timestamp: string;
}

const STORAGE_KEY = 'rucio_recent_pages';
const MAX_RECENT = 10;

/**
 * Check if code is running in browser environment
 */
function isBrowser(): boolean {
    return typeof window !== 'undefined';
}

/**
 * Check if a URL should be excluded from recent pages
 * Excludes auth pages, error pages, and API routes
 */
function shouldExcludePage(url: string): boolean {
    const excludePatterns = ['/auth/', '/api/', '/error', '/_next/', '/404', '/500'];

    return excludePatterns.some(pattern => url.includes(pattern));
}

/**
 * Get all recent pages from localStorage
 * @param limit Maximum number of pages to return (default: 5 for command palette)
 * @returns Array of recent pages, sorted by timestamp (newest first)
 */
export function getRecentPages(limit: number = 5): RecentPage[] {
    if (!isBrowser()) {
        return [];
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return [];
        }

        const pages: RecentPage[] = JSON.parse(stored);

        // Sort by timestamp descending (newest first)
        const sorted = pages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        // Return limited number of pages
        return sorted.slice(0, limit);
    } catch (error) {
        console.error('Failed to get recent pages:', error);
        return [];
    }
}

/**
 * Add or update a page in recent pages
 * De-duplicates by URL and maintains max limit
 * @param url Page URL (relative path)
 * @param title Page title
 */
export function addRecentPage(url: string, title: string): void {
    if (!isBrowser()) {
        return;
    }

    // Skip if should be excluded
    if (shouldExcludePage(url)) {
        return;
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        let pages: RecentPage[] = stored ? JSON.parse(stored) : [];

        // Remove existing entry with same URL (de-duplicate)
        pages = pages.filter(page => page.url !== url);

        // Add new entry at the beginning
        const newPage: RecentPage = {
            url,
            title,
            timestamp: new Date().toISOString(),
        };

        pages.unshift(newPage);

        // Keep only MAX_RECENT pages
        pages = pages.slice(0, MAX_RECENT);

        // Save back to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
    } catch (error) {
        console.error('Failed to add recent page:', error);
    }
}

/**
 * Clear all recent pages
 */
export function clearRecentPages(): void {
    if (!isBrowser()) {
        return;
    }

    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear recent pages:', error);
    }
}

/**
 * Format timestamp for display (e.g., "2 minutes ago", "1 hour ago")
 * @param timestamp ISO timestamp string
 * @returns Formatted relative time string
 */
export function formatRecentPageTime(timestamp: string): string {
    const now = new Date().getTime();
    const then = new Date(timestamp).getTime();
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
        return 'Just now';
    } else if (diffMins < 60) {
        return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return new Date(timestamp).toLocaleDateString();
    }
}
