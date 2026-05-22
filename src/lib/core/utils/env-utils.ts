/**
 * Parses a boolean-like environment variable string.
 * Accepts 'true', '1', 'yes', 'on' (case-insensitive, trimmed) as truthy.
 */
export function parseBoolEnv(value: string | undefined): boolean {
    if (!value) return false;
    const normalised = value.trim().toLowerCase();
    return normalised === 'true' || normalised === '1' || normalised === 'yes' || normalised === 'on';
}
