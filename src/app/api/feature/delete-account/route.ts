import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { DeleteAccountControllerParameters } from '@/lib/infrastructure/controller/delete-account-controller';
import { executeAuthenticatedController, parseRequestBody } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { withFeature } from '@/lib/infrastructure/adapters/with-feature';
import { withAdmin } from '@/lib/infrastructure/adapters/with-admin';
import { ACCOUNT_NAME_REGEX } from '@/lib/core/utils/account-validation';

const BodySchema = z.object({ account: z.string().regex(ACCOUNT_NAME_REGEX, 'Invalid account name') }).strict();

/**
 * DELETE /api/feature/delete-account
 * Body: { account }
 * Admin only. Rucio keeps a tombstone, so a deleted account name cannot be reused.
 */
async function deleteHandler(request: NextRequest) {
    const body = await parseRequestBody(request);
    const params = BodySchema.safeParse(body);
    if (!params.success) {
        return NextResponse.json(
            { status: 'error', errorType: 'validation_error', message: params.error.errors[0]?.message ?? 'Invalid request' },
            { status: 400 },
        );
    }
    const controller = appContainer.get<BaseController<DeleteAccountControllerParameters, void>>(CONTROLLERS.DELETE_ACCOUNT);
    return executeAuthenticatedController(controller, { account: params.data.account });
}

export const DELETE = withFeature(CONTROLLERS.DELETE_ACCOUNT, withAdmin(deleteHandler));
