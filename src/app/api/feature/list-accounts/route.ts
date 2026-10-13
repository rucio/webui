import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { ListAccountsControllerParameters } from '@/lib/infrastructure/controller/list-accounts-controller';
import { executeAuthenticatedController } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { withFeature } from '@/lib/infrastructure/adapters/with-feature';
import { withAdmin } from '@/lib/infrastructure/adapters/with-admin';
import { ACCOUNT_NAME_PATTERN_REGEX } from '@/lib/core/utils/account-validation';
import { AccountType } from '@/lib/core/entity/rucio';
import { AccountListFilter } from '@/lib/core/entity/account';

const QuerySchema = z.object({
    account: z.string().regex(ACCOUNT_NAME_PATTERN_REGEX).optional(),
    accountType: z.enum([AccountType.USER, AccountType.GROUP, AccountType.SERVICE]).optional(),
    identity: z.string().max(1024).optional(),
});

/**
 * GET /api/feature/list-accounts
 * Query params: account (name pattern, optional), accountType (USER | GROUP | SERVICE, optional), identity (optional)
 * Streams the accounts matching the filter. Admins only.
 */
async function getHandler(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const params = QuerySchema.safeParse({
        account: searchParams.get('account') ?? undefined,
        accountType: searchParams.get('accountType') ?? undefined,
        identity: searchParams.get('identity') ?? undefined,
    });
    if (!params.success) {
        return NextResponse.json({ status: 'error', errorType: 'validation_error', message: 'Invalid account filter' }, { status: 400 });
    }
    const filter: AccountListFilter = {};
    if (params.data.account !== undefined) filter.account = params.data.account;
    if (params.data.accountType !== undefined) filter.accountType = params.data.accountType;
    if (params.data.identity !== undefined) filter.identity = params.data.identity;

    const controller = appContainer.get<BaseController<ListAccountsControllerParameters, void>>(CONTROLLERS.LIST_ACCOUNTS);
    return executeAuthenticatedController(controller, { filter }, true);
}

export const GET = withFeature(CONTROLLERS.LIST_ACCOUNTS, withAdmin(getHandler));
