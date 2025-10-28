import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { CreateRuleControllerParameters } from '@/lib/infrastructure/controller/create-rule-controller';
import { CreateRuleRequest } from '@/lib/core/usecase-models/create-rule-usecase-models';
import { executeAuthenticatedController, parseRequestBody } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { getSessionUser } from '@/lib/infrastructure/auth/nextauth-session-utils';

const CreateRuleSchema = z.object({
    dids: z
        .array(
            z.object({
                scope: z.string().min(1),
                name: z.string().min(1),
            })
        )
        .nonempty(),
    copies: z.number().min(1),
    rse_expression: z.string().min(1),
    grouping: z.enum(['ALL', 'DATASET', 'NONE']).optional(),
    lifetime_days: z.number().int().positive().optional(),
    notify: z.boolean().optional(),
    comments: z.string().optional(),
    ask_approval: z.boolean().optional(),
    asynchronous: z.boolean().optional(),
    sample: z.boolean().optional(),
    sample_file_count: z.number().int().positive().optional(),
});

/**
 * POST /api/feature/create-rule
 * Body: { dids, copies, rse_expression, ... }
 * Creates a new replication rule
 */
export async function POST(request: NextRequest) {
    try {
        const sessionUser = await getSessionUser();

        if (!sessionUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await parseRequestBody(request);

        if (!body) {
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        const params = CreateRuleSchema.safeParse(body);
        if (!params.success) {
            return NextResponse.json(
                {
                    error: 'Missing required parameters or provided parameters are invalid',
                    details: params.error.errors,
                },
                { status: 400 }
            );
        }

        const controller = appContainer.get<BaseController<CreateRuleControllerParameters, CreateRuleRequest>>(
            CONTROLLERS.CREATE_RULE
        );

        return executeAuthenticatedController(controller, {
            account: sessionUser.rucioAccount,
            ...params.data,
        });
    } catch (error) {
        console.error('Error in create-rule:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
