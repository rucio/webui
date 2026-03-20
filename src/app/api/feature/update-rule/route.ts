import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { UpdateRuleControllerParameters } from '@/lib/infrastructure/controller/update-rule-controller';
import { UpdateRuleRequest } from '@/lib/core/usecase-models/update-rule-usecase-models';
import { executeAuthenticatedController, parseRequestBody } from '@/lib/infrastructure/adapters/app-router-controller-adapter';

const UpdateRuleSchema = z.object({
    ruleId: z.string().min(1),
    options: z
        .object({
            lifetime: z.number().nullable().optional(),
            approve: z.boolean().optional(),
            comment: z.string().optional(),
            priority: z.number().optional(),
        })
        .refine(obj => Object.keys(obj).length > 0, {
            message: 'At least one update option must be provided',
        }),
});

/**
 * PUT /api/feature/update-rule
 * Body: { ruleId, options: { lifetime?, approve?, comment?, priority? } }
 * Updates a replication rule's options
 */
export async function PUT(request: NextRequest) {
    try {
        const body = await parseRequestBody(request);

        if (!body) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const params = UpdateRuleSchema.safeParse(body);
        if (!params.success) {
            return NextResponse.json(
                {
                    error: 'Missing required parameters or provided parameters are invalid',
                    details: params.error.errors,
                },
                { status: 400 },
            );
        }

        const controller = appContainer.get<BaseController<UpdateRuleControllerParameters, UpdateRuleRequest>>(CONTROLLERS.UPDATE_RULE);

        return executeAuthenticatedController(controller, params.data);
    } catch (error) {
        console.error('Error in update-rule:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
