import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { AddAccountIdentityControllerParameters } from '@/lib/infrastructure/controller/add-account-identity-controller';
import { executeAuthenticatedController, parseRequestBody } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { withFeature } from '@/lib/infrastructure/adapters/with-feature';
import { withAdmin } from '@/lib/infrastructure/adapters/with-admin';
import { ACCOUNT_NAME_REGEX, isValidEmail } from '@/lib/core/utils/account-validation';
import { IdentityType, IDENTITY_TYPES } from '@/lib/core/entity/account';

const BodySchema = z
    .object({
        account: z.string().regex(ACCOUNT_NAME_REGEX, 'Invalid account name'),
        identity: z.string().trim().min(1, 'Identity is required').max(4096),
        authType: z.enum(IDENTITY_TYPES),
        email: z.string().refine(isValidEmail, 'Invalid email'),
        password: z.string().min(1).optional(),
        isDefault: z.boolean().optional(),
    })
    .strict();

/**
 * POST /api/feature/add-account-identity
 * Body: { account, identity, authType, email, password?, isDefault? }
 * The body can contain a password: never log it.
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
    const controller = appContainer.get<BaseController<AddAccountIdentityControllerParameters, void>>(CONTROLLERS.ADD_ACCOUNT_IDENTITY);
    return executeAuthenticatedController(controller, { ...params.data, authType: params.data.authType as IdentityType });
}

export const POST = withFeature(CONTROLLERS.ADD_ACCOUNT_IDENTITY, withAdmin(handler));
