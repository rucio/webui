export const SCOPE_DELIMITER = ':';

export const parseDIDPattern = (pattern: string | null | undefined): { scope: string | null; name: string | null } => {
    const patternParts = pattern?.split(SCOPE_DELIMITER);
    if (patternParts && patternParts.length >= 2) {
        return {
            scope: patternParts[0] || null,
            name: patternParts.slice(1).join(SCOPE_DELIMITER) || null,
        };
    }

    return { scope: null, name: null };
};
