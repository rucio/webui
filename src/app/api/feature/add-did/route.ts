import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { AddDIDControllerParameters } from '@/lib/infrastructure/controller/add-did-controller';
import { AddDIDRequest } from '@/lib/core/usecase-models/add-did-usecase-models';
import { executeAuthenticatedController, parseRequestBody } from '@/lib/infrastructure/adapters/app-router-controller-adapter';

const AddDIDSchema = z.object({
    scope: z.string().min(1),
    name: z.string().min(1),
    type: z.enum(['Dataset', 'Container']),
});

/**
 * POST /api/feature/add-did
 * Body: { scope, name, type: 'Dataset' | 'Container' }
 * Creates a new DID (Data Identifier)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await parseRequestBody(request);

        if (!body) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const params = AddDIDSchema.safeParse(body);
        if (!params.success) {
            return NextResponse.json(
                {
                    error: 'Missing required parameters or provided parameters are invalid',
                    details: params.error.errors,
                },
                { status: 400 },
            );
        }

        const controller = appContainer.get<BaseController<AddDIDControllerParameters, AddDIDRequest>>(CONTROLLERS.ADD_DID);

        return executeAuthenticatedController(controller, params.data);
    } catch (error) {
        console.error('Error in add-did:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
