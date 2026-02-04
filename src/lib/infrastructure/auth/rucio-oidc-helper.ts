/**
 * Rucio OIDC Helper
 *
 * Provides utilities for mapping OIDC identities to Rucio accounts
 * using Rucio's identity API with in-memory caching.
 */

/**
 * Custom errors for OIDC identity lookup
 */
export class IdentityNotMappedError extends Error {
    constructor(identity: string) {
        super(`OIDC identity "${identity}" is not mapped to any Rucio account`);
        this.name = 'IdentityNotMappedError';
    }
}

export class InvalidTokenError extends Error {
    constructor(message: string) {
        super(`Invalid OIDC token: ${message}`);
        this.name = 'InvalidTokenError';
    }
}

export class RucioAPIError extends Error {
    constructor(statusCode: number, message: string) {
        super(`Rucio API error (${statusCode}): ${message}`);
        this.name = 'RucioAPIError';
    }
}

/**
 * Cache entry structure
 */
interface CacheEntry {
    accounts: string[];
    timestamp: number;
}

/**
 * In-memory cache for identity-to-account mappings
 * Key format: "SUB=xxx, ISS=yyy@https://rucio-host.cern.ch"
 */
const accountCache = new Map<string, CacheEntry>();

/**
 * Cache TTL: 5 minutes
 */
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Constructs a cache key from identity string and Rucio host
 */
function getCacheKey(identityString: string, rucioHost: string): string {
    return `${identityString}@${rucioHost}`;
}

/**
 * Checks if a cache entry is still valid
 */
function isCacheValid(entry: CacheEntry): boolean {
    const now = Date.now();
    return now - entry.timestamp < CACHE_TTL;
}

/**
 * Retrieves accounts from cache if available and valid
 */
function getFromCache(identityString: string, rucioHost: string): string[] | null {
    const key = getCacheKey(identityString, rucioHost);
    const entry = accountCache.get(key);

    if (entry && isCacheValid(entry)) {
        console.log(`[OIDC Helper] Cache hit for identity: ${identityString}`);
        return entry.accounts;
    }

    if (entry) {
        console.log(`[OIDC Helper] Cache expired for identity: ${identityString}`);
        accountCache.delete(key);
    }

    return null;
}

/**
 * Stores accounts in cache
 */
function setCache(identityString: string, rucioHost: string, accounts: string[]): void {
    const key = getCacheKey(identityString, rucioHost);
    const entry: CacheEntry = {
        accounts,
        timestamp: Date.now(),
    };
    accountCache.set(key, entry);
    console.log(`[OIDC Helper] Cached ${accounts.length} account(s) for identity: ${identityString}`);
}

/**
 * Clears the entire cache (useful for testing or manual invalidation)
 */
export function clearAccountCache(): void {
    accountCache.clear();
    console.log('[OIDC Helper] Account cache cleared');
}

/**
 * Retrieves Rucio accounts mapped to an OIDC identity
 *
 * This function queries Rucio's identity API to find which Rucio account(s)
 * are associated with a given OIDC identity (SUB + ISS claims).
 *
 * Uses the query parameter-based endpoint: GET /identities/accounts?identity_key={identity}&type=OIDC
 * This endpoint better handles special characters in identity strings (e.g., slashes in ISS URLs).
 *
 * Results are cached for 5 minutes to reduce API calls.
 *
 * @param identityString - The OIDC identity in Rucio format: "SUB={sub}, ISS={issuer}"
 * @param rucioHost - The Rucio server host URL (e.g., "https://rucio.cern.ch")
 * @param oidcToken - The OIDC JWT token to authenticate with Rucio
 * @returns Array of Rucio account names mapped to this identity
 * @throws {IdentityNotMappedError} If the identity is not registered in Rucio
 * @throws {InvalidTokenError} If the token is invalid or expired
 * @throws {RucioAPIError} If Rucio returns an error
 *
 * @example
 * const accounts = await getRucioAccountsForIdentity(
 *   "SUB=mayank, ISS=https://auth.cern.ch/auth/realms/cern",
 *   "https://mayank-ops.cern.ch",
 *   "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
 * );
 * // Returns: ["mayank_account"]
 */
export async function getRucioAccountsForIdentity(identityString: string, rucioHost: string, oidcToken: string): Promise<string[]> {
    console.log(`[OIDC Helper] Looking up accounts for identity: ${identityString}`);

    // Check cache first
    const cachedAccounts = getFromCache(identityString, rucioHost);
    if (cachedAccounts !== null) {
        return cachedAccounts;
    }

    // Use new query parameter-based endpoint instead of path-based
    // This handles special characters (like slashes in ISS URLs) much better
    // New endpoint: GET /identities/accounts?identity_key={identity}&type={type}
    // Old endpoint: GET /identities/{identity}/{type}/accounts (had encoding issues)
    const params = new URLSearchParams({
        identity_key: identityString, // URLSearchParams handles encoding automatically
        type: 'OIDC',
    });

    // Construct the API URL with query parameters
    const apiUrl = `${rucioHost}/identities/accounts?${params.toString()}`;

    // SECURITY: Detailed debug logging disabled - DO NOT enable in production
    // console.log('='.repeat(70));
    // console.log('=== OIDC IDENTITY LOOKUP DEBUG INFO ===');
    // console.log('='.repeat(70));
    // console.log(`Identity String (raw):     "${identityString}"`);
    // console.log(`Identity Type:             OIDC`);
    // console.log(`Rucio Host:                ${rucioHost}`);
    // console.log(`Full API URL:              ${apiUrl}`);
    // console.log(`Token (first 50 chars):    ${oidcToken.substring(0, 50)}...`);
    // console.log(`Token (last 20 chars):     ...${oidcToken.substring(oidcToken.length - 20)}`);
    // console.log('='.repeat(70));
    // console.log('');
    console.log(`[OIDC Helper] Calling Rucio API: GET ${apiUrl}`);

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-Rucio-Auth-Token': oidcToken,
                'Content-Type': 'application/json',
            },
        });

        console.log(`[OIDC Helper] Rucio API response status: ${response.status}`);

        // Handle error responses
        if (!response.ok) {
            if (response.status === 404) {
                // Identity not found in Rucio database - log details for debugging
                const responseText = await response.text();
                console.error('='.repeat(70));
                console.error('=== 404 ERROR: IDENTITY NOT FOUND IN RUCIO ===');
                console.error('='.repeat(70));
                console.error(`Identity queried:    "${identityString}"`);
                console.error(`Identity type:       OIDC`);
                console.error(`API endpoint:        ${apiUrl}`);
                console.error(`Response body:       ${responseText || '(empty)'}`);
                console.error('');
                console.error('Possible causes:');
                console.error('1. Identity string format mismatch (check spaces, case, order)');
                console.error('2. Identity not registered in Rucio database');
                console.error('3. Wrong identity type (should be OIDC)');
                console.error('');
                // SECURITY: Debug instructions disabled - DO NOT enable in production
                // console.error('To debug:');
                // console.error('1. Check Rucio database for identity format:');
                // console.error("   SELECT * FROM identities WHERE identity LIKE '%mayank%';");
                // console.error('2. Try manual curl with the token from [OIDC_TOKEN] log:');
                // console.error(`   curl -H "X-Rucio-Auth-Token: $TOKEN" \\`);
                // console.error(`        "${rucioHost}/identities/accounts?identity_key=${encodeURIComponent(identityString)}&type=OIDC"`);
                // console.error('3. Verify identity is associated with an account:');
                // console.error(`   SELECT * FROM account_map WHERE identity = '${identityString}';`);
                // console.error('='.repeat(70));
                throw new IdentityNotMappedError(identityString);
            } else if (response.status === 401) {
                // Token is invalid or expired
                const errorText = await response.text();
                console.error(`[OIDC Helper] 401 Unauthorized response: ${errorText}`);
                throw new InvalidTokenError(errorText || 'Unauthorized');
            } else {
                // Other Rucio API errors
                const errorText = await response.text();
                console.error(`[OIDC Helper] Rucio API error ${response.status}: ${errorText}`);
                throw new RucioAPIError(response.status, errorText || 'Unknown error');
            }
        }

        // Parse the response
        const accountsData = await response.json();
        console.log(`[OIDC Helper] Received accounts data:`, accountsData);

        // Extract account names from the response
        // The API returns an array of objects with 'account' property
        const accounts: string[] = Array.isArray(accountsData) ? accountsData.map((item: any) => item.account || item) : [];

        if (accounts.length === 0) {
            throw new IdentityNotMappedError(identityString);
        }

        console.log(`[OIDC Helper] Found ${accounts.length} account(s): ${accounts.join(', ')}`);

        // Cache the results
        setCache(identityString, rucioHost, accounts);

        return accounts;
    } catch (error) {
        // Re-throw our custom errors
        if (error instanceof IdentityNotMappedError || error instanceof InvalidTokenError || error instanceof RucioAPIError) {
            throw error;
        }

        // Handle network errors or other unexpected errors
        console.error('[OIDC Helper] Error calling Rucio API:', error);
        throw new RucioAPIError(500, `Network error: ${(error as Error).message}`);
    }
}

/**
 * Helper function to extract account from identity lookup result
 *
 * Handles the case of multiple accounts by returning the first one.
 * In the future, this could be enhanced to:
 * - Check for a default account
 * - Allow user to choose from multiple accounts
 * - Store all accounts in session for switching
 *
 * @param accounts - Array of account names
 * @returns The account name to use
 */
export function selectAccountFromMultiple(accounts: string[]): string {
    if (accounts.length === 0) {
        throw new Error('No accounts provided');
    }

    if (accounts.length === 1) {
        return accounts[0];
    }

    // Multiple accounts: return the first one
    // TODO: In the future, implement default account logic or let user choose
    console.log(`[OIDC Helper] Multiple accounts found: ${accounts.join(', ')}. Using first account: ${accounts[0]}`);
    return accounts[0];
}
