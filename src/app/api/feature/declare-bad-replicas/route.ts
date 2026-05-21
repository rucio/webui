import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { DeclareBadReplicasControllerParameters } from '@/lib/infrastructure/controller/declare-bad-replicas-controller';
import { DeclareBadReplicasRequest } from '@/lib/core/usecase-models/declare-bad-replicas-usecase-models';
import { executeAuthenticatedController, parseRequestBody } from '@/lib/infrastructure/adapters/app-router-controller-adapter';

const DeclareBadReplicasSchema = z.object({
    dids: z
        .array(
            z.object({
                scope: z.string().min(1),
                name: z.string().min(1),
            }),
        )
        .min(1),
    rse: z.string().min(1),
    reason: z.string().min(1),
    expiresAt: z.string().nullable().optional(),
});

/**
 * POST /api/feature/declare-bad-replicas
 * Body: { dids: [{scope, name}], rse, reason, expiresAt? }
 * Marks the supplied replicas as BAD on the specified RSE via Rucio's
 * `POST /replicas/bad/dids` endpoint.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await parseRequestBody(request);
        if (!body) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const params = DeclareBadReplicasSchema.safeParse(body);
        if (!params.success) {
            return NextResponse.json(
                { error: 'Missing required parameters or provided parameters are invalid', details: params.error.errors },
                { status: 400 },
            );
        }

        const controller = appContainer.get<BaseController<DeclareBadReplicasControllerParameters, DeclareBadReplicasRequest>>(
            CONTROLLERS.DECLARE_BAD_REPLICAS,
        );

        return executeAuthenticatedController(controller, params.data);
    } catch (error) {
        console.error('Error in declare-bad-replicas:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
