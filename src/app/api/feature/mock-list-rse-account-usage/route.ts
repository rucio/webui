import 'reflect-metadata';
import { executeAuthenticatedStream, arrayToNDJSONStream, createStreamingResponse } from '@/lib/infrastructure/adapters/streaming-adapter';
import { RSEAccountUsageViewModel } from '@/lib/infrastructure/data/view-model/rse';

/**
 * Generate mock RSE account usage data
 * Inline implementation to avoid importing client-side hooks from test fixtures
 */
function generateMockRSEAccountUsage(count: number): RSEAccountUsageViewModel[] {
    const mockData: RSEAccountUsageViewModel[] = [];
    for (let i = 0; i < count; i++) {
        mockData.push({
            status: 'success',
            rse_id: `rse-id-${i}`,
            rse: `MOCK-RSE-${i}`,
            account: 'mockaccount',
            used_bytes: Math.floor(Math.random() * 1000000000),
            bytes_limit: Math.floor(Math.random() * 2000000000),
            files: Math.floor(Math.random() * 10000),
        });
    }
    return mockData;
}

/**
 * GET /api/feature/mock-list-rse-account-usage
 * Mock streaming endpoint for testing RSE account usage data
 * Returns a stream of mock RSE account usage data for development/testing
 */
export async function GET() {
    return executeAuthenticatedStream(async (user, token) => {
        try {
            // Generate mock RSE account usage data
            const data = generateMockRSEAccountUsage(10);

            // Convert array to NDJSON stream
            const stream = arrayToNDJSONStream(data);

            // Return streaming response with proper headers
            return createStreamingResponse(stream);
        } catch (error) {
            console.error('Error in mock-list-rse-account-usage:', error);
            return new Response(
                JSON.stringify({
                    error: 'Internal server error',
                    message: error instanceof Error ? error.message : 'Unknown error',
                }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }
    });
}
