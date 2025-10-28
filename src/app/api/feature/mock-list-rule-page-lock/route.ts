import 'reflect-metadata';
import { executeAuthenticatedStream, arrayToNDJSONStream, createStreamingResponse } from '@/lib/infrastructure/adapters/streaming-adapter';
import { RulePageLockEntryViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { LockState } from '@/lib/core/entity/rucio';

/**
 * Generate mock rule page lock data
 * Inline implementation to avoid importing client-side hooks from test fixtures
 */
function generateMockRulePageLock(count: number): RulePageLockEntryViewModel[] {
    const mockData: RulePageLockEntryViewModel[] = [];
    const lockStates = [LockState.OK, LockState.REPLICATING, LockState.STUCK];

    for (let i = 0; i < count; i++) {
        mockData.push({
            status: 'success',
            scope: 'mock',
            name: `file-${i}.dat`,
            rse: `MOCK-RSE-${i % 3}`,
            state: lockStates[i % lockStates.length],
            ddm_link: `https://mock-ddm-link-${i}`,
            fts_link: `https://mock-fts-link-${i}`,
        });
    }
    return mockData;
}

/**
 * GET /api/feature/mock-list-rule-page-lock
 * Mock streaming endpoint for testing rule page lock states
 * Returns a stream of mock rule page lock entry data for development/testing
 */
export async function GET() {
    return executeAuthenticatedStream(async (user, token) => {
        try {
            // Generate mock rule page lock data
            const data = generateMockRulePageLock(10);

            // Convert array to NDJSON stream
            const stream = arrayToNDJSONStream(data);

            // Return streaming response with proper headers
            return createStreamingResponse(stream);
        } catch (error) {
            console.error('Error in mock-list-rule-page-lock:', error);
            return new Response(
                JSON.stringify({
                    error: 'Internal server error',
                    message: error instanceof Error ? error.message : 'Unknown error',
                }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
    });
}
