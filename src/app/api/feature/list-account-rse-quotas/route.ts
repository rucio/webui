import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { ListAccountRSEQuotasControllerParameters } from '@/lib/infrastructure/controller/list-account-rse-quotas-controller';
import { executeAuthenticatedController, parseRequestBody } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { getSessionUser } from '@/lib/infrastructure/auth/nextauth-session-utils';
import { DIDLong } from '@/lib/core/entity/rucio';

const DIDLongSchema = z.object({
    scope: z.string(),
    name: z.string(),
});

const RequestSchema = z.object({
    requestedDIDs: z.array(DIDLongSchema).min(1),
    rseExpression: z.string().optional().default(''),
});

/**
 * POST /api/feature/list-account-rse-quotas
 * Body: { requestedDIDs: DIDLong[], rseExpression?: string }
 * Returns RSE quotas for the given account and DIDs
 */
export async function POST(request: NextRequest) {
    try {
        const sessionUser = await getSessionUser();

        if (!sessionUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!sessionUser.rucioAccount) {
            return NextResponse.json({ error: 'Unauthorized: Rucio Account is not set' }, { status: 401 });
        }

        const body = await parseRequestBody(request);
        if (!body) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const params = RequestSchema.safeParse(body);
        if (!params.success) {
            return NextResponse.json({ error: 'Invalid parameters', details: params.error.errors }, { status: 400 });
        }

        const controller = appContainer.get<BaseController<ListAccountRSEQuotasControllerParameters, void>>(CONTROLLERS.LIST_ACCOUNT_RSE_QUOTAS);

        return executeAuthenticatedController(
            controller,
            {
                account: sessionUser.rucioAccount,
                requestedDIDs: params.data.requestedDIDs as DIDLong[],
                rseExpression: params.data.rseExpression,
            },
            true, // streaming endpoint
        );
    } catch (error) {
        console.error('Error in list-account-rse-quotas:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
