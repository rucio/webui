import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { ListSuspiciousReplicasControllerParameters } from '@/lib/infrastructure/controller/list-suspicious-replicas-controller';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';

/**
 * GET /api/feature/list-suspicious-replicas
 * Query params (all optional): rse_expression, younger_than, nattempts
 * Returns a streamed NDJSON response of SuspiciousReplicaViewModel items.
 */
export async function GET(request: NextRequest) {
    try {
        const params = parseQueryParams(request);

        const rseExpression = params.rse_expression as string | undefined;
        const youngerThan = params.younger_than as string | undefined;
        const nattemptsRaw = params.nattempts as string | undefined;
        const nattempts = nattemptsRaw !== undefined ? parseInt(nattemptsRaw, 10) : undefined;

        const controller = appContainer.get<BaseController<ListSuspiciousReplicasControllerParameters, void>>(
            CONTROLLERS.LIST_SUSPICIOUS_REPLICAS,
        );

        return executeAuthenticatedController(
            controller,
            {
                rseExpression,
                youngerThan,
                nattempts: !isNaN(nattempts as number) ? nattempts : undefined,
            },
            true,
        );
    } catch (error) {
        console.error('Error in list-suspicious-replicas:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
