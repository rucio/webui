import { NextResponse } from 'next/server';
import packageJson from '../../../../package.json';

/**
 * GET /api/ping
 * Health check endpoint for Kubernetes liveness/readiness probes
 * Returns the current WebUI version
 */
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        version: packageJson.version,
    });
}
