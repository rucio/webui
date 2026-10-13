import { AccountType } from '@/lib/core/entity/rucio';
import { ListAccountsRequest } from '@/lib/core/usecase-models/list-accounts-usecase-models';
import { ListAccountsControllerParameters } from '@/lib/infrastructure/controller/list-accounts-controller';
import { AccountListItemViewModel } from '@/lib/infrastructure/data/view-model/account';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { Readable } from 'stream';
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

function collect(res: ReturnType<typeof MockHttpStreamableResponseFactory.getMockResponse>): Promise<any[]> {
    const received: any[] = [];
    const onData = (data: any) => received.push(JSON.parse(data));
    return new Promise((resolve, reject) => {
        res.on('data', onData);
        res.on('end', () => {
            res.off('data', onData);
            resolve(received);
        });
        res.on('error', err => {
            res.off('data', onData);
            reject(err);
        });
    });
}

describe('Feature: ListAccounts', () => {
    beforeEach(() => {
        fetchMock.doMock();
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    const run = async (filter: ListAccountsControllerParameters['filter']) => {
        const res = MockHttpStreamableResponseFactory.getMockResponse();
        const controller = appContainer.get<BaseController<ListAccountsControllerParameters, ListAccountsRequest>>(CONTROLLERS.LIST_ACCOUNTS);
        await controller.execute({
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            filter,
        });
        return res;
    };

    it('streams the accounts and forwards only the set filter keys', async () => {
        const endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/`,
            method: 'GET',
            includes: 'accounts/',
            response: {
                status: 200,
                headers: { 'Content-Type': 'application/x-json-stream' },
                body: Readable.from(
                    [
                        JSON.stringify({ account: 'root', type: 'SERVICE', email: null }),
                        JSON.stringify({ account: 'jdoe', type: 'USER', email: 'j@example.org' }),
                    ].join('\n'),
                ),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [endpoint]);

        const res = await run({ accountType: AccountType.USER });
        const rows: AccountListItemViewModel[] = await collect(res);

        expect(rows).toHaveLength(2);
        expect(rows[0]).toMatchObject({ status: 'success', account: 'root', accountType: AccountType.SERVICE, email: null });
        expect(rows[1]).toMatchObject({ status: 'success', account: 'jdoe', accountType: AccountType.USER, email: 'j@example.org' });

        const requested = new URL(fetchMock.mock.calls.map(c => String(c[0])).find(u => u.includes('/accounts/')) as string);
        expect(requested.searchParams.get('account_type')).toBe('USER');
        expect(requested.searchParams.has('account')).toBe(false);
        expect(requested.searchParams.has('identity')).toBe(false);
    });

    it('returns a 400 validation error for an invalid account filter', async () => {
        MockRucioServerFactory.createMockRucioServer(true, []);
        const res = await run({ account: 'Not Valid!' });

        expect(res._getStatusCode()).toBe(400);
        const data: AccountListItemViewModel = await res._getJSONData();
        expect(data.status).toBe('error');
        expect(data.errorType).toBe('validation_error');
    });

    it('returns errorType permission_denied for 401 AccessDenied', async () => {
        const endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/`,
            method: 'GET',
            includes: 'accounts/',
            response: {
                status: 401,
                headers: { 'Content-Type': 'application/json', ExceptionClass: 'AccessDenied' },
                body: JSON.stringify({ ExceptionClass: 'AccessDenied', ExceptionMessage: 'Access denied' }),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [endpoint]);

        const res = await run({});
        expect(res._getStatusCode()).toBe(401);
        const data: AccountListItemViewModel = await res._getJSONData();
        expect(data.status).toBe('error');
        expect(data.errorType).toBe('permission_denied');
    });
});
