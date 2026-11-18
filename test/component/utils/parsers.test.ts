import { parseDIDPattern, SCOPE_DELIMITER } from '@/component-library/features/utils/parsers';

describe('Parsers', () => {
    describe('parseDIDPattern', () => {
        it.each(['scope:name', 'test:dataset1', 'test:*', '*:*'])('parse %s', scopeAndName => {
            const patternParts = scopeAndName.split(SCOPE_DELIMITER);
            const scope = patternParts[0];
            const name = patternParts[1];
            expect(parseDIDPattern(scopeAndName)).toMatchObject({ scope: scope, name: name });
        });
        it.each(['scope:name:secondName', 'scope:::::'])('stores all of %s additional delimiters in name', scopeAndName => {
            const { name } = parseDIDPattern(scopeAndName);
            expect(name).toContain(SCOPE_DELIMITER);
        });
        it.each(['scope:', ':name', ':'])('scope, name or both of them are null for %s pattern', scopeAndName => {
            const parsed = parseDIDPattern(scopeAndName);
            expect(Object.values(parsed)).toContain(null);
        });
    });
});
