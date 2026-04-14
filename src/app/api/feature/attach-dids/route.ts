import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { AttachDIDsControllerParameters } from '@/lib/infrastructure/controller/attach-dids-controller';
import { AttachDIDsRequest } from '@/lib/core/usecase-models/attach-dids-usecase-models';
import { executeAuthenticatedController, parseRequestBody } from '@/lib/infrastructure/adapters/app-router-controller-adapter';

const AttachDIDsSchema = z.object({
    dids: z
        .array(
            z.object({
                scope: z.string().min(1),
                name: z.string().min(1),
            }),
        )
        .nonempty(),
    scope: z.string().min(1),
    name: z.string().min(1),
});

/**
 * POST /api/feature/attach-dids
 * Body: { dids: [{ scope, name }], scope, name }
 * Attaches multiple DIDs to a container or dataset
 */
export async function POST(request: NextRequest) {
    try {
        const body = await parseRequestBody(request);

        if (!body) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const params = AttachDIDsSchema.safeParse(body);
        if (!params.success) {
            return NextResponse.json(
                {
                    error: 'Missing required parameters or provided parameters are invalid',
                    details: params.error.errors,
                },
                { status: 400 },
            );
        }

        const controller = appContainer.get<BaseController<AttachDIDsControllerParameters, AttachDIDsRequest>>(CONTROLLERS.ATTACH_DIDS);

        return executeAuthenticatedController(controller, params.data);
    } catch (error) {
        console.error('Error in attach-dids:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
