import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { UpdateAccountControllerParameters } from '@/lib/infrastructure/controller/update-account-controller';
import { executeAuthenticatedController, parseRequestBody } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { withFeature } from '@/lib/infrastructure/adapters/with-feature';
import { withAdmin } from '@/lib/infrastructure/adapters/with-admin';
import { ACCOUNT_NAME_REGEX, isValidEmail } from '@/lib/core/utils/account-validation';
import { ACCOUNT_TYPES } from '@/lib/core/entity/rucio';
import { AccountUpdateOptions } from '@/lib/core/entity/account';

const BodySchema = z
    .object({
        account: z.string().regex(ACCOUNT_NAME_REGEX, 'Invalid account name'),
        options: z
            .object({
                email: z.string().refine(isValidEmail, 'Invalid email').nullable().optional(),
                // DELETED is not accepted: accounts are deleted through the delete-account feature
                status: z.enum(['ACTIVE', 'SUSPENDED']).optional(),
                accountType: z.enum(ACCOUNT_TYPES).optional(),
            })
            .strict()
            .refine(options => Object.keys(options).length > 0, { message: 'At least one update option must be provided' }),
    })
    .strict();

/**
 * PUT /api/feature/update-account
 * Body: { account, options: { email?, status?, accountType? } }
 * Admin only. Changes the email, type or status (suspend / reactivate) of an account.
 */
async function putHandler(request: NextRequest) {
    const body = await parseRequestBody(request);
    const params = BodySchema.safeParse(body);
    if (!params.success) {
        return NextResponse.json(
            { status: 'error', errorType: 'validation_error', message: params.error.issues[0]?.message ?? 'Invalid request' },
            { status: 400 },
        );
    }
    const controller = appContainer.get<BaseController<UpdateAccountControllerParameters, void>>(CONTROLLERS.UPDATE_ACCOUNT);
    return executeAuthenticatedController(controller, { account: params.data.account, options: params.data.options as AccountUpdateOptions });
}

export const PUT = withFeature(CONTROLLERS.UPDATE_ACCOUNT, withAdmin(putHandler));
