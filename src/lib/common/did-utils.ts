/**
 * A utility function to parse DID strings into their scope and name components.
 * @param didString The query string to parse.
 * @param allowWildcardNames If true, wildcard names are allowed in the name component of the DID string.
 * @returns The scope and name components of the DID string as a tuple
 * @throws An error if the DID string is invalid.
 */
export function parseDIDString(didString: string, allowWildcardNames: boolean = true): { scope: string; name: string } {
    const didParts = didString.trim().split(':');
    if (didParts.length !== 2) throw new Error('Invalid DID string');
    if (!allowWildcardNames && didParts[1].includes('*')) throw new Error('Invalid DID string, wildcard names not allowed');
    return {
        scope: didParts[0],
        name: didParts[1],
    };
}
