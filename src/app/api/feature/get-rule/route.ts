import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { GetRuleControllerParameters } from '@/lib/infrastructure/controller/get-rule-controller';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';

/**
 * GET /api/feature/get-rule
 * Query params: id
 * Returns detailed information about a specific rule
 */
export async function GET(request: NextRequest) {
    try {
        const params = parseQueryParams(request);
        const id = params.id as string;

        if (!id) {
            return NextResponse.json({ error: 'Missing required parameter: id' }, { status: 400 });
        }

        const controller = appContainer.get<BaseController<GetRuleControllerParameters, void>>(CONTROLLERS.GET_RULE);

        return executeAuthenticatedController(controller, { id });
    } catch (error) {
        console.error('Error in get-rule:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
