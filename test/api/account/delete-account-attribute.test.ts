import { DeleteAccountAttributeRequest } from '@/lib/core/usecase-models/delete-account-attribute-usecase-models';
import { DeleteAccountAttributeControllerParameters } from '@/lib/infrastructure/controller/delete-account-attribute-controller';
import { DeleteAccountAttributeViewModel } from '@/lib/infrastructure/data/view-model/account';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { jsonRequest, loadRoute } from './route-test-utils';

const EM_DASH = String.fromCharCode(0x2014);

describe('Feature: DeleteAccountAttribute', () => {
    beforeEach(() => {
        fetchMock.doMock();
    });

    afterEach(() => {
        fetchMock.dontMock();
        jest.restoreAllMocks();
    });

    const mockRucio = (status: number, exceptionClass?: string, requestValidator?: MockEndpoint['requestValidator']) => {
        const endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe/attr/k1`,
            method: 'DELETE',
            response: {
                status,
                headers: { 'Content-Type': 'application/json', ...(exceptionClass ? { ExceptionClass: exceptionClass } : {}) },
                body: status < 300 ? '' : JSON.stringify({ ExceptionMessage: 'nope', ...(exceptionClass ? { ExceptionClass: exceptionClass } : {}) }),
            },
            requestValidator,
        };
        MockRucioServerFactory.createMockRucioServer(true, [endpoint]);
    };

    const run = async (overrides: Partial<DeleteAccountAttributeControllerParameters> = {}) => {
        const { res } = await createHttpMocks('/api/feature/delete-account-attribute', 'DELETE', {});
        const controller = appContainer.get<BaseController<DeleteAccountAttributeControllerParameters, DeleteAccountAttributeRequest>>(
            CONTROLLERS.DELETE_ACCOUNT_ATTRIBUTE,
        );
        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            account: 'jdoe',
            key: 'k1',
            ...overrides,
        });
        return res;
    };

    it('deletes the attribute', async () => {
        mockRucio(200);
        const res = await run();
        expect(res._getStatusCode()).toBe(200);
        expect((await res._getJSONData()).status).toBe('success');
    });

    it('reports a missing account or attribute', async () => {
        mockRucio(404, 'AccountNotFound');
        const res = await run();
        expect(res._getStatusCode()).toBe(404);
        const data: DeleteAccountAttributeViewModel = await res._getJSONData();
        expect(data.errorType).toBe('not_found');
        expect(data.message).toBe('The account was not found or is not active.');
        expect(data.message).not.toContain(EM_DASH);
    });
});

describe('Route: DELETE /api/feature/delete-account-attribute', () => {
    const call = async (body: unknown) => {
        const { route, execute } = loadRoute<typeof import('@/app/api/feature/delete-account-attribute/route')>(
            '@/app/api/feature/delete-account-attribute/route',
        );
        const response = (await route.DELETE(jsonRequest('DELETE', body))) as Response;
        return { response, execute };
    };

    it('passes valid params to the controller', async () => {
        const { response, execute } = await call({ account: 'jdoe', key: 'k1' });
        expect(response.status).toBe(200);
        expect(execute).toHaveBeenCalledWith(expect.anything(), { account: 'jdoe', key: 'k1' });
    });

    it.each([
        ['an invalid account', { account: 'Bad Name', key: 'k1' }],
        ['an invalid key', { account: 'jdoe', key: 'a b' }],
        ['a missing key', { account: 'jdoe' }],
        ['extra keys', { account: 'jdoe', key: 'k1', value: 'v' }],
    ])('returns 400 for %s', async (_name, body) => {
        const { response, execute } = await call(body);
        expect(response.status).toBe(400);
        expect(((await response.json()) as { errorType: string }).errorType).toBe('validation_error');
        expect(execute).not.toHaveBeenCalled();
    });
});
