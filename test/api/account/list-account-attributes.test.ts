import { ListAccountAttributesRequest } from '@/lib/core/usecase-models/list-account-attributes-usecase-models';
import { ListAccountAttributesControllerParameters } from '@/lib/infrastructure/controller/list-account-attributes-controller';
import { AccountAttributesViewModel } from '@/lib/infrastructure/data/view-model/account';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

describe('Feature: ListAccountAttributes', () => {
    beforeEach(() => {
        fetchMock.doMock();
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    const run = async (account: string) => {
        const { res } = await createHttpMocks('/api/feature/list-account-attributes?account=' + account, 'GET', {});
        const controller = appContainer.get<BaseController<ListAccountAttributesControllerParameters, ListAccountAttributesRequest>>(
            CONTROLLERS.LIST_ACCOUNT_ATTRIBUTES,
        );
        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            account,
        });
        return res;
    };

    it('returns the attributes of the account', async () => {
        const endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe/attr/`,
            method: 'GET',
            response: {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([
                    { key: 'admin', value: true },
                    { key: 'team', value: 'physics' },
                ]),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [endpoint]);

        const res = await run('jdoe');
        expect(res._getStatusCode()).toBe(200);
        const data: AccountAttributesViewModel = await res._getJSONData();
        expect(data.status).toBe('success');
        expect(data.attributes).toEqual([
            { key: 'admin', value: true },
            { key: 'team', value: 'physics' },
        ]);
    });

    it.each([
        [404, undefined, 'not_found'],
        [401, 'AccessDenied', 'permission_denied'],
        [401, undefined, 'unauthorized'],
    ])('maps gateway status %s (%s) to errorType %s', async (status, exceptionClass, errorType) => {
        const endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe/attr/`,
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
        const data: AccountAttributesViewModel = await res._getJSONData();
        expect(data.status).toBe('error');
        expect(data.errorType).toBe(errorType);
        expect(data.attributes).toEqual([]);
    });
});
