import { useMemo } from 'react';

export type JSONViewerMode = 'static' | 'interactive' | 'auto';
export type ResolvedMode = 'static' | 'interactive';

/**
 * Helper function to calculate the maximum depth of a nested object or array.
 * @param obj - The object or array to analyze
 * @param currentDepth - Current recursion depth (internal use)
 * @returns Maximum depth of the structure
 */
function getMaxDepth(obj: any, currentDepth: number = 0): number {
    if (obj === null || typeof obj !== 'object') {
        return currentDepth;
    }

    if (Array.isArray(obj)) {
        if (obj.length === 0) return currentDepth + 1;
        return Math.max(...obj.map((item) => getMaxDepth(item, currentDepth + 1)));
    }

    const keys = Object.keys(obj);
    if (keys.length === 0) return currentDepth + 1;

    return Math.max(...keys.map((key) => getMaxDepth(obj[key], currentDepth + 1)));
}

/**
 * Helper function to count total keys across all nested objects.
 * @param obj - The object to analyze
 * @returns Total number of keys in the structure
 */
function countAllKeys(obj: any): number {
    if (obj === null || typeof obj !== 'object') {
        return 0;
    }

    if (Array.isArray(obj)) {
        return obj.reduce((sum, item) => sum + countAllKeys(item), 0);
    }

    const keys = Object.keys(obj);
    return keys.length + keys.reduce((sum, key) => sum + countAllKeys(obj[key]), 0);
}

/**
 * Detects JSON complexity and determines the appropriate display mode.
 *
 * Uses interactive mode when:
 * 1. It's an array with multiple items (2+)
 * 2. It's an object with depth > 2 levels
 * 3. Total keys across all nested objects > 10
 *
 * Otherwise uses static mode for simple JSON structures.
 *
 * @param jsonString - The JSON string to analyze
 * @returns 'static' or 'interactive'
 */
export function detectJSONComplexity(jsonString: string): ResolvedMode {
    try {
        const parsed = JSON.parse(jsonString);

        // Use interactive if it's an array with multiple items
        if (Array.isArray(parsed) && parsed.length > 1) {
            return 'interactive';
        }

        // Use interactive if it's an object with significant complexity
        if (parsed !== null && typeof parsed === 'object') {
            const depth = getMaxDepth(parsed);
            const totalKeys = countAllKeys(parsed);

            if (depth > 2 || totalKeys > 10) {
                return 'interactive';
            }
        }

        // Default to static for simple structures
        return 'static';
    } catch {
        // Invalid JSON, use static mode to display raw value
        return 'static';
    }
}

/**
 * Hook to determine the appropriate JSON viewer mode based on complexity.
 *
 * @param value - The JSON string to analyze
 * @param mode - The mode preference ('static', 'interactive', or 'auto')
 * @returns The resolved mode ('static' or 'interactive')
 *
 * @example
 * ```tsx
 * const resolvedMode = useJSONComplexity(jsonString, 'auto');
 * ```
 */
export function useJSONComplexity(value: string, mode: JSONViewerMode = 'auto'): ResolvedMode {
    return useMemo(() => {
        // If explicit mode is specified, use it
        if (mode === 'static' || mode === 'interactive') {
            return mode;
        }

        // Auto-detect based on complexity
        return detectJSONComplexity(value);
    }, [value, mode]);
}
