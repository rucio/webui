import { ListAccountIdentitiesRequest } from '@/lib/core/usecase-models/list-account-identities-usecase-models';
import { ListAccountIdentitiesControllerParameters } from '@/lib/infrastructure/controller/list-account-identities-controller';
import { AccountIdentitiesViewModel } from '@/lib/infrastructure/data/view-model/account';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

describe('Feature: ListAccountIdentities', () => {
    beforeEach(() => {
        fetchMock.doMock();
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    const run = async (account: string) => {
        const { res } = await createHttpMocks('/api/feature/list-account-identities?account=' + account, 'GET', {});
        const controller = appContainer.get<BaseController<ListAccountIdentitiesControllerParameters, ListAccountIdentitiesRequest>>(
            CONTROLLERS.LIST_ACCOUNT_IDENTITIES,
        );
        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            account,
        });
        return res;
    };

    it('returns the identities of the account', async () => {
        const endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe/identities`,
            method: 'GET',
            response: {
                status: 200,
                headers: { 'Content-Type': 'application/x-json-stream' },
                body: [
                    JSON.stringify({ type: 'USERPASS', identity: 'jdoe', email: 'j@example.org' }),
                    JSON.stringify({ type: 'X509', identity: '/DC=ch/CN=J Doe', email: 'j@example.org' }),
                ].join('\n'),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [endpoint]);

        const res = await run('jdoe');
        expect(res._getStatusCode()).toBe(200);
        const data: AccountIdentitiesViewModel = await res._getJSONData();
        expect(data.status).toBe('success');
        expect(data.identities).toEqual([
            { identity: 'jdoe', type: 'USERPASS', email: 'j@example.org' },
            { identity: '/DC=ch/CN=J Doe', type: 'X509', email: 'j@example.org' },
        ]);
    });

    it.each([
        [404, undefined, 'not_found'],
        [401, 'AccessDenied', 'permission_denied'],
        [401, undefined, 'unauthorized'],
    ])('maps gateway status %s (%s) to errorType %s', async (status, exceptionClass, errorType) => {
        const endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe/identities`,
            method: 'GET',
            response: {
                status,
                headers: { 'Content-Type': 'application/json', ...(exceptionClass ? { ExceptionClass: exceptionClass } : {}) },
                body: JSON.stringify({ ExceptionMessage: 'nope', ...(exceptionClass ? { ExceptionClass: exceptionClass } : {}) }),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [endpoint]);

        const res = await run('jdoe');
        expect(res._getStatusCode()).toBe(status);
        const data: AccountIdentitiesViewModel = await res._getJSONData();
        expect(data.status).toBe('error');
        expect(data.errorType).toBe(errorType);
        expect(data.identities).toEqual([]);
    });
});
