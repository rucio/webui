import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { DeleteAccountLimitControllerParameters } from '@/lib/infrastructure/controller/delete-account-limit-controller';
import { executeAuthenticatedController, parseRequestBody } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { withFeature } from '@/lib/infrastructure/adapters/with-feature';
import { withAdmin } from '@/lib/infrastructure/adapters/with-admin';
import { ACCOUNT_NAME_REGEX } from '@/lib/core/utils/account-validation';

const BodySchema = z
    .object({
        account: z.string().regex(ACCOUNT_NAME_REGEX, 'Invalid account name'),
        locality: z.enum(['local', 'global']),
        rseExpression: z.string().min(1, 'RSE expression is required').max(500),
    })
    .strict();

/**
 * DELETE /api/feature/delete-account-limit
 * Body: { account, locality, rseExpression }
 * Admin only.
 */
async function handler(request: NextRequest) {
    const body = await parseRequestBody(request);
    const params = BodySchema.safeParse(body);
    if (!params.success) {
        return NextResponse.json(
            { status: 'error', errorType: 'validation_error', message: params.error.issues[0]?.message ?? 'Invalid request' },
            { status: 400 },
        );
    }
    const controller = appContainer.get<BaseController<DeleteAccountLimitControllerParameters, void>>(CONTROLLERS.DELETE_ACCOUNT_LIMIT);
    return executeAuthenticatedController(controller, params.data);
}

export const DELETE = withFeature(CONTROLLERS.DELETE_ACCOUNT_LIMIT, withAdmin(handler));
