import { DeleteAccountRequest } from '@/lib/core/usecase-models/delete-account-usecase-models';
import { DeleteAccountControllerParameters } from '@/lib/infrastructure/controller/delete-account-controller';
import { DeleteAccountViewModel } from '@/lib/infrastructure/data/view-model/account';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { jsonRequest, loadRoute } from './route-test-utils';

describe('Feature: DeleteAccount', () => {
    beforeEach(() => {
        fetchMock.doMock();
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    const mockRucio = (status: number, exceptionClass?: string) => {
        const endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe`,
            method: 'DELETE',
            response: {
                status,
                headers: { 'Content-Type': 'application/json', ...(exceptionClass ? { ExceptionClass: exceptionClass } : {}) },
                body: status < 300 ? '' : JSON.stringify({ ExceptionMessage: 'nope', ...(exceptionClass ? { ExceptionClass: exceptionClass } : {}) }),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [endpoint]);
    };

    const run = async () => {
        const { res } = await createHttpMocks('/api/feature/delete-account', 'DELETE', {});
        const controller = appContainer.get<BaseController<DeleteAccountControllerParameters, DeleteAccountRequest>>(CONTROLLERS.DELETE_ACCOUNT);
        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            account: 'jdoe',
        });
        return res;
    };

    it('deletes the account', async () => {
        mockRucio(200);
        const res = await run();
        expect(res._getStatusCode()).toBe(200);
        expect((await res._getJSONData()).status).toBe('success');
    });

    it('reports a missing account with the not-found message', async () => {
        mockRucio(404, 'AccountNotFound');
        const res = await run();
        expect(res._getStatusCode()).toBe(404);
        const data: DeleteAccountViewModel = await res._getJSONData();
        expect(data.errorType).toBe('not_found');
        expect(data.message).toBe('The account was not found or is not active.');
    });

    it('explains that only root can delete accounts when Rucio answers AccessDenied', async () => {
        mockRucio(401, 'AccessDenied');
        const res = await run();
        const data: DeleteAccountViewModel = await res._getJSONData();
        expect(data.errorType).toBe('permission_denied');
        expect(data.message).toBe('Only the root account can create or delete accounts on this Rucio server.');
    });
});

describe('Route: DELETE /api/feature/delete-account', () => {
    const del = async (body: unknown) => {
        const { route, execute } = loadRoute<typeof import('@/app/api/feature/delete-account/route')>('@/app/api/feature/delete-account/route');
        const response = (await route.DELETE(jsonRequest('DELETE', body))) as Response;
        return { response, execute };
    };

    it('reads the account from the JSON body', async () => {
        const { response, execute } = await del({ account: 'jdoe' });
        expect(response.status).toBe(200);
        expect(execute).toHaveBeenCalledWith(expect.anything(), { account: 'jdoe' });
    });

    it.each([
        ['an invalid name', { account: 'Bad Name' }],
        ['a missing account', {}],
        ['extra keys', { account: 'jdoe', force: true }],
    ])('returns 400 for %s', async (_name, body) => {
        const { response, execute } = await del(body);
        expect(response.status).toBe(400);
        expect(execute).not.toHaveBeenCalled();
    });
});
