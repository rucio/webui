import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { DeleteAccountIdentityControllerParameters } from '@/lib/infrastructure/controller/delete-account-identity-controller';
import { executeAuthenticatedController, parseRequestBody } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { withFeature } from '@/lib/infrastructure/adapters/with-feature';
import { withAdmin } from '@/lib/infrastructure/adapters/with-admin';
import { ACCOUNT_NAME_REGEX } from '@/lib/core/utils/account-validation';
import { IdentityType } from '@/lib/core/entity/account';

const BodySchema = z
    .object({
        account: z.string().regex(ACCOUNT_NAME_REGEX, 'Invalid account name'),
        identity: z.string().trim().min(1, 'Identity is required').max(4096),
        authType: z.enum(['X509', 'GSS', 'USERPASS', 'SSH', 'SAML', 'OIDC']),
    })
    .strict();

/**
 * DELETE /api/feature/delete-account-identity
 * Body: { account, identity, authType }
 * Admin only.
 */
async function handler(request: NextRequest) {
    const body = await parseRequestBody(request);
    const params = BodySchema.safeParse(body);
    if (!params.success) {
        return NextResponse.json(
            { status: 'error', errorType: 'validation_error', message: params.error.errors[0]?.message ?? 'Invalid request' },
            { status: 400 },
        );
    }
    const controller = appContainer.get<BaseController<DeleteAccountIdentityControllerParameters, void>>(CONTROLLERS.DELETE_ACCOUNT_IDENTITY);
    return executeAuthenticatedController(controller, { ...params.data, authType: params.data.authType as IdentityType });
}

export const DELETE = withFeature(CONTROLLERS.DELETE_ACCOUNT_IDENTITY, withAdmin(handler));
