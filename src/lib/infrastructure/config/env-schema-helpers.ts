import { z } from 'zod';

/**
 * Zod building blocks for environment variables. Env values are always strings (or unset),
 * so every helper treats a blank string the same as an unset variable.
 */

const TRUE_VALUES = ['true', '1', 'yes', 'on'];
const FALSE_VALUES = ['false', '0', 'no', 'off'];

const blankToUndefined = (value: unknown) => (typeof value === 'string' && value.trim() === '' ? undefined : value);

export const requiredString = z.preprocess(blankToUndefined, z.string({ required_error: 'is required' }).trim());

export const optionalString = z.preprocess(blankToUndefined, z.string().trim().optional());

export const stringWithDefault = (fallback: string) => z.preprocess(blankToUndefined, z.string().trim().default(fallback));

export const requiredUrl = z.preprocess(blankToUndefined, z.string({ required_error: 'is required' }).trim().url('must be a valid URL'));

export const optionalUrl = z.preprocess(blankToUndefined, z.string().trim().url('must be a valid URL').optional());

export const urlWithDefault = (fallback: string) => z.preprocess(blankToUndefined, z.string().trim().url('must be a valid URL').default(fallback));

/**
 * Parses true/false, 1/0, yes/no and on/off (case-insensitive). Unset or blank falls back to the default;
 * anything else is a validation error rather than being silently read as false.
 */
export const envBoolean = (fallback: boolean) =>
    z.preprocess(value => {
        const normalized = blankToUndefined(value);
        if (typeof normalized !== 'string') return normalized;
        const lowered = normalized.trim().toLowerCase();
        if (TRUE_VALUES.includes(lowered)) return true;
        if (FALSE_VALUES.includes(lowered)) return false;
        return normalized;
    }, z.boolean({ invalid_type_error: `must be one of ${[...TRUE_VALUES, ...FALSE_VALUES].join(', ')}` }).default(fallback));

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

export function formatEnvIssues(issues: z.ZodIssue[]): string {
    return issues.map(issue => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`).join('\n');
}
