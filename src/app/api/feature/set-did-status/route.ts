import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { SetDIDStatusControllerParameters } from '@/lib/infrastructure/controller/set-did-status-controller';
import { SetDIDStatusRequest } from '@/lib/core/usecase-models/set-did-status-usecase-models';
import { executeAuthenticatedController, parseRequestBody } from '@/lib/infrastructure/adapters/app-router-controller-adapter';

const SetDIDStatusSchema = z.object({
    scope: z.string().min(1),
    name: z.string().min(1),
    open: z.boolean(),
});

/**
 * PUT /api/feature/set-did-status
 * Body: { scope, name, open: boolean }
 * Sets the status of a DID (open/closed)
 */
export async function PUT(request: NextRequest) {
    try {
        const body = await parseRequestBody(request);

        if (!body) {
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        const params = SetDIDStatusSchema.safeParse(body);
        if (!params.success) {
            return NextResponse.json(
                {
                    error: 'Missing required parameters or provided parameters are invalid',
                    details: params.error.errors,
                },
                { status: 400 }
            );
        }

        const controller = appContainer.get<BaseController<SetDIDStatusControllerParameters, SetDIDStatusRequest>>(
            CONTROLLERS.SET_DID_STATUS
        );

        return executeAuthenticatedController(controller, params.data);
    } catch (error) {
        console.error('Error in set-did-status:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
