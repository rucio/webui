import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { DIDKeyValuePairsDataControllerParameters } from '@/lib/infrastructure/controller/did-keyvaluepairs-controller';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';

/**
 * GET /api/feature/get-did-keyvaluepairs
 * Query params: scope, name
 * Returns key-value pairs (metadata attributes) for a specific DID
 */
export async function GET(request: NextRequest) {
    try {
        const params = parseQueryParams(request);
        const scope = params.scope as string;
        const name = params.name as string;

        if (!scope || !name) {
            return NextResponse.json(
                { error: 'Missing required parameters: scope and name' },
                { status: 400 }
            );
        }

        const controller = appContainer.get<BaseController<DIDKeyValuePairsDataControllerParameters, void>>(
            CONTROLLERS.DID_KEYVALUEPAIRS
        );

        return executeAuthenticatedController(controller, { scope, name });
    } catch (error) {
        console.error('Error in get-did-keyvaluepairs:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
