import 'reflect-metadata';
import { executeAuthenticatedStream, arrayToNDJSONStream, createStreamingResponse } from '@/lib/infrastructure/adapters/streaming-adapter';
import { RuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { RuleState } from '@/lib/core/entity/rucio';

/**
 * Generate mock rule data
 * Inline implementation to avoid importing client-side hooks from test fixtures
 */
function generateMockRules(count: number): RuleViewModel[] {
    const mockData: RuleViewModel[] = [];
    const ruleStates = [RuleState.OK, RuleState.REPLICATING, RuleState.STUCK];

    for (let i = 0; i < count; i++) {
        mockData.push({
            status: 'success',
            id: `rule-id-${i}`,
            scope: 'mock',
            name: `dataset-${i}`,
            account: 'mockaccount',
            state: ruleStates[i % ruleStates.length],
            rse_expression: 'MOCK-RSE',
            locks_ok_cnt: Math.floor(Math.random() * 100),
            locks_replicating_cnt: Math.floor(Math.random() * 50),
            locks_stuck_cnt: Math.floor(Math.random() * 10),
            created_at: new Date().toISOString(),
            remaining_lifetime: 86400 * (i + 1),
        });
    }
    return mockData;
}

/**
 * GET /api/feature/template-stream
 * Template endpoint for streaming NDJSON data with authentication
 * Returns a stream of mock rule data
 */
export async function GET() {
    return executeAuthenticatedStream(async (user, token) => {
        try {
            // Generate mock data
            const data = generateMockRules(10);

            // Convert array to NDJSON stream
            const stream = arrayToNDJSONStream(data);

            // Return streaming response with proper headers
            return createStreamingResponse(stream);
        } catch (error) {
            console.error('Error in template-stream:', error);
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
