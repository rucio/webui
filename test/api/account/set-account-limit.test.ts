import { SetAccountLimitRequest } from '@/lib/core/usecase-models/set-account-limit-usecase-models';
import { SetAccountLimitControllerParameters } from '@/lib/infrastructure/controller/set-account-limit-controller';
import { SetAccountLimitViewModel } from '@/lib/infrastructure/data/view-model/account';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { jsonRequest, loadRoute } from './route-test-utils';

const EM_DASH = String.fromCharCode(0x2014);

describe('Feature: SetAccountLimit', () => {
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
            method: 'POST',
            response: {
                status,
                headers: { 'Content-Type': 'application/json', ...(exceptionClass ? { ExceptionClass: exceptionClass } : {}) },
                body: status < 300 ? '' : JSON.stringify({ ExceptionMessage: 'nope', ...(exceptionClass ? { ExceptionClass: exceptionClass } : {}) }),
            },
            requestValidator,
        };
        MockRucioServerFactory.createMockRucioServer(true, [endpoint]);
    };

    const run = async (overrides: Partial<SetAccountLimitControllerParameters> = {}) => {
        const { res } = await createHttpMocks('/api/feature/set-account-limit', 'POST', {});
        const controller = appContainer.get<BaseController<SetAccountLimitControllerParameters, SetAccountLimitRequest>>(
            CONTROLLERS.SET_ACCOUNT_LIMIT,
        );
        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            account: 'jdoe',
            locality: 'local',
            rseExpression: 'MOCK',
            bytes: 1000,
            ...overrides,
        });
        return res;
    };

    it('sets the limit', async () => {
        let sent: unknown;
        mockRucio(200, undefined, undefined, async req => {
            sent = await req.json();
            return true;
        });
        const res = await run();
        expect(res._getStatusCode()).toBe(200);
        expect((await res._getJSONData()).status).toBe('success');
        expect(sent).toEqual({ bytes: 1000 });
    });

    it('accepts -1 as unlimited', async () => {
        let sent: unknown;
        mockRucio(200, undefined, undefined, async req => {
            sent = await req.json();
            return true;
        });
        const res = await run({ bytes: -1 });
        expect(res._getStatusCode()).toBe(200);
        expect(sent).toEqual({ bytes: -1 });
    });

    it('reports a missing account as not found', async () => {
        mockRucio(404, 'AccountNotFound');
        const res = await run();
        expect(res._getStatusCode()).toBe(404);
        const data: SetAccountLimitViewModel = await res._getJSONData();
        expect(data.errorType).toBe('not_found');
        expect(data.message).toBe('The account was not found or is not active.');
        expect(data.message).not.toContain(EM_DASH);
    });

    it('reports a non-admin caller as permission denied', async () => {
        mockRucio(401, 'AccessDenied');
        const res = await run();
        expect(res._getStatusCode()).toBe(401);
        const data: SetAccountLimitViewModel = await res._getJSONData();
        expect(data.errorType).toBe('permission_denied');
        expect(data.message).not.toContain(EM_DASH);
    });
});

describe('Route: PUT /api/feature/set-account-limit', () => {
    const valid = { account: 'jdoe', locality: 'local', rseExpression: 'MOCK', bytes: 1000 };

    const call = async (body: unknown) => {
        const { route, execute } = loadRoute<typeof import('@/app/api/feature/set-account-limit/route')>('@/app/api/feature/set-account-limit/route');
        const response = (await route.PUT(jsonRequest('PUT', body))) as Response;
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

    it('accepts -1 as unlimited', async () => {
        const { response, execute } = await call({ ...valid, bytes: -1 });
        expect(response.status).toBe(200);
        expect(execute).toHaveBeenCalledWith(expect.anything(), { ...valid, bytes: -1 });
    });

    it.each([
        ['an invalid account', { ...valid, account: 'Bad Name' }],
        ['an unknown locality', { ...valid, locality: 'regional' }],
        ['an empty rse expression', { ...valid, rseExpression: '' }],
        ['an over-long rse expression', { ...valid, rseExpression: 'a'.repeat(501) }],
        ['extra keys', { ...valid, foo: 1 }],
        ['bytes below -1', { ...valid, bytes: -2 }],
        ['fractional bytes', { ...valid, bytes: 1.5 }],
        ['missing bytes', { account: 'jdoe', locality: 'local', rseExpression: 'MOCK' }],
    ])('returns 400 for %s', async (_name, body) => {
        const { response, execute } = await call(body);
        expect(response.status).toBe(400);
        expect(((await response.json()) as { errorType: string }).errorType).toBe('validation_error');
        expect(execute).not.toHaveBeenCalled();
    });
});
