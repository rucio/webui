import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { DeleteAccountAttributeControllerParameters } from '@/lib/infrastructure/controller/delete-account-attribute-controller';
import { executeAuthenticatedController, parseRequestBody } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { withFeature } from '@/lib/infrastructure/adapters/with-feature';
import { withAdmin } from '@/lib/infrastructure/adapters/with-admin';
import { ACCOUNT_NAME_REGEX, ACCOUNT_ATTRIBUTE_REGEX } from '@/lib/core/utils/account-validation';

const BodySchema = z
    .object({
        account: z.string().regex(ACCOUNT_NAME_REGEX, 'Invalid account name'),
        key: z.string().regex(ACCOUNT_ATTRIBUTE_REGEX, 'Invalid attribute key'),
    })
    .strict();

/**
 * DELETE /api/feature/delete-account-attribute
 * Body: { account, key }
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
    const controller = appContainer.get<BaseController<DeleteAccountAttributeControllerParameters, void>>(CONTROLLERS.DELETE_ACCOUNT_ATTRIBUTE);
    return executeAuthenticatedController(controller, params.data);
}

export const DELETE = withFeature(CONTROLLERS.DELETE_ACCOUNT_ATTRIBUTE, withAdmin(handler));
