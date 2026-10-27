import { z } from 'zod';

/**
 * Zod building blocks for environment variables. Env values are always strings (or unset),
 * so every helper treats a blank string the same as an unset variable.
 */

const TRUE_VALUES = ['true', '1', 'yes', 'on'];
const FALSE_VALUES = ['false', '0', 'no', 'off'];

/** Trims strings and turns blank ones into undefined, so they count as unset. */
const normalize = (value: unknown) => (typeof value === 'string' ? value.trim() || undefined : value);

const required = { error: (issue: { input?: unknown }) => (issue.input === undefined ? 'is required' : undefined) };
const invalidUrl = { error: (issue: { input?: unknown }) => (issue.input === undefined ? 'is required' : 'must be a valid URL') };

export const requiredString = z.preprocess(normalize, z.string(required));

export const optionalString = z.preprocess(normalize, z.string().optional());

export const stringWithDefault = (fallback: string) => z.preprocess(normalize, z.string().default(fallback));

export const requiredUrl = z.preprocess(normalize, z.url(invalidUrl));

export const optionalUrl = z.preprocess(normalize, z.url(invalidUrl).optional());

/**
 * Parses true/false, 1/0, yes/no and on/off (case-insensitive). Unset or blank falls back to the default;
 * anything else is a validation error rather than being silently read as false.
 */
export const envBoolean = (fallback: boolean) =>
    z.preprocess(value => {
        const normalized = normalize(value);
        if (typeof normalized !== 'string') return normalized;
        const lowered = normalized.toLowerCase();
        if (TRUE_VALUES.includes(lowered)) return true;
        if (FALSE_VALUES.includes(lowered)) return false;
        return normalized;
    }, z.boolean({ error: `must be one of ${[...TRUE_VALUES, ...FALSE_VALUES].join(', ')}` }).default(fallback));

/**
 * Comma separated list, e.g. `cern, indigo`. Entries are trimmed and empty entries dropped.
 */
export const csvList = (fallback: string[] = []) =>
    z.preprocess(
        value =>
            typeof value === 'string'
                ? value
                      .split(',')
                      .map(entry => entry.trim())
                      .filter(entry => entry !== '')
                : value,
        z.array(z.string()).default(fallback),
    );

export function formatEnvIssues(issues: z.core.$ZodIssue[]): string {
    return issues.map(issue => `  - ${issue.path.map(String).join('.') || '(root)'}: ${issue.message}`).join('\n');
}
