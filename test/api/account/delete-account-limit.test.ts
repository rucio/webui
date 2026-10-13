import { DeleteAccountLimitRequest } from '@/lib/core/usecase-models/delete-account-limit-usecase-models';
import { DeleteAccountLimitControllerParameters } from '@/lib/infrastructure/controller/delete-account-limit-controller';
import { DeleteAccountLimitViewModel } from '@/lib/infrastructure/data/view-model/account';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { jsonRequest, loadRoute } from './route-test-utils';

const EM_DASH = String.fromCharCode(0x2014);

describe('Feature: DeleteAccountLimit', () => {
    beforeEach(() => {
        fetchMock.doMock();
    });

    afterEach(() => {
        fetchMock.dontMock();
        jest.restoreAllMocks();
    });

    const mockRucio = (status: number, exceptionClass?: string, rseExpression = 'MOCK', requestValidator?: MockEndpoint['requestValidator']) => {
        const locality = rseExpression === 'MOCK' ? 'local' : 'global';
        const endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe/limits/${locality}/${encodeURIComponent(rseExpression)}`,
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

    const run = async (overrides: Partial<DeleteAccountLimitControllerParameters> = {}) => {
        const { res } = await createHttpMocks('/api/feature/delete-account-limit', 'DELETE', {});
        const controller = appContainer.get<BaseController<DeleteAccountLimitControllerParameters, DeleteAccountLimitRequest>>(
            CONTROLLERS.DELETE_ACCOUNT_LIMIT,
        );
        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            account: 'jdoe',
            locality: 'local',
            rseExpression: 'MOCK',
            ...overrides,
        });
        return res;
    };

    it('removes the limit', async () => {
        mockRucio(200);
        const res = await run();
        expect(res._getStatusCode()).toBe(200);
        expect((await res._getJSONData()).status).toBe('success');
    });

    it('round-trips a global RSE expression', async () => {
        const expression = 'tier=1&(country=DE|country=FR)';
        mockRucio(200, undefined, expression);
        const res = await run({ locality: 'global', rseExpression: expression });
        expect(res._getStatusCode()).toBe(200);
        expect((await res._getJSONData()).status).toBe('success');
    });

    it('reports a missing account as not found', async () => {
        mockRucio(404, 'AccountNotFound');
        const res = await run();
        expect(res._getStatusCode()).toBe(404);
        const data: DeleteAccountLimitViewModel = await res._getJSONData();
        expect(data.errorType).toBe('not_found');
        expect(data.message).toBe('The account was not found or is not active.');
        expect(data.message).not.toContain(EM_DASH);
    });

    it('reports a non-admin caller as permission denied', async () => {
        mockRucio(401, 'AccessDenied');
        const res = await run();
        expect(res._getStatusCode()).toBe(401);
        const data: DeleteAccountLimitViewModel = await res._getJSONData();
        expect(data.errorType).toBe('permission_denied');
        expect(data.message).not.toContain(EM_DASH);
    });
});

describe('Route: DELETE /api/feature/delete-account-limit', () => {
    const valid = { account: 'jdoe', locality: 'local', rseExpression: 'MOCK' };

    const call = async (body: unknown) => {
        const { route, execute } = loadRoute<typeof import('@/app/api/feature/delete-account-limit/route')>(
            '@/app/api/feature/delete-account-limit/route',
        );
        const response = (await route.DELETE(jsonRequest('DELETE', body))) as Response;
        return { response, execute };
    };

    it('passes valid params to the controller', async () => {
        const { response, execute } = await call(valid);
        expect(response.status).toBe(200);
        expect(execute).toHaveBeenCalledWith(expect.anything(), valid);
    });

    it('accepts a global locality with an RSE expression', async () => {
        const body = { ...valid, locality: 'global', rseExpression: 'tier=1&(country=DE|country=FR)' };
        const { response, execute } = await call(body);
        expect(response.status).toBe(200);
        expect(execute).toHaveBeenCalledWith(expect.anything(), body);
    });

    it.each([
        ['an invalid account', { ...valid, account: 'Bad Name' }],
        ['an unknown locality', { ...valid, locality: 'regional' }],
        ['an empty rse expression', { ...valid, rseExpression: '' }],
        ['an over-long rse expression', { ...valid, rseExpression: 'a'.repeat(501) }],
        ['extra keys', { ...valid, foo: 1 }],
    ])('returns 400 for %s', async (_name, body) => {
        const { response, execute } = await call(body);
        expect(response.status).toBe(400);
        expect(((await response.json()) as { errorType: string }).errorType).toBe('validation_error');
        expect(execute).not.toHaveBeenCalled();
    });
});
