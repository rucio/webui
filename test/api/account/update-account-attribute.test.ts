import { UpdateAccountAttributeRequest } from '@/lib/core/usecase-models/update-account-attribute-usecase-models';
import { UpdateAccountAttributeControllerParameters } from '@/lib/infrastructure/controller/update-account-attribute-controller';
import { UpdateAccountAttributeViewModel } from '@/lib/infrastructure/data/view-model/account';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { jsonRequest, loadRoute } from './route-test-utils';

const EM_DASH = String.fromCharCode(0x2014);
const HOST = MockRucioServerFactory.RUCIO_HOST;

const json = (status: number, body: unknown = '', exceptionClass?: string) => ({
    status,
    headers: { 'Content-Type': 'application/json', ...(exceptionClass ? { ExceptionClass: exceptionClass } : {}) },
    body: typeof body === 'string' ? body : JSON.stringify(body),
});
const failure = (status: number, exceptionClass: string) => json(status, { ExceptionMessage: 'nope', ExceptionClass: exceptionClass }, exceptionClass);

describe('Feature: UpdateAccountAttribute', () => {
    beforeEach(() => {
        fetchMock.doMock();
    });

    afterEach(() => {
        fetchMock.dontMock();
        jest.restoreAllMocks();
    });

    const mockRucio = (opts: { existing?: unknown[]; del?: MockEndpoint['response']; add?: MockEndpoint['response'] }) => {
        const endpoints: MockEndpoint[] = [
            { url: `${HOST}/accounts/jdoe/attr/`, method: 'GET', response: json(200, opts.existing ?? [{ key: 'k1', value: 'old' }]) },
            { url: `${HOST}/accounts/jdoe/attr/k1`, method: 'DELETE', response: opts.del ?? json(200) },
            { url: `${HOST}/accounts/jdoe/attr/k1`, method: 'POST', response: opts.add ?? json(201) },
        ];
        MockRucioServerFactory.createMockRucioServer(true, endpoints);
    };

    const run = async (overrides: Partial<UpdateAccountAttributeControllerParameters> = {}) => {
        const { res } = await createHttpMocks('/api/feature/update-account-attribute', 'PUT', {});
        const controller = appContainer.get<BaseController<UpdateAccountAttributeControllerParameters, UpdateAccountAttributeRequest>>(
            CONTROLLERS.UPDATE_ACCOUNT_ATTRIBUTE,
        );
        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            account: 'jdoe',
            key: 'k1',
            value: 'new',
            ...overrides,
        });
        return res;
    };

    it('replaces the value of an existing attribute', async () => {
        mockRucio({});
        const res = await run();
        expect(res._getStatusCode()).toBe(200);
        expect((await res._getJSONData()).status).toBe('success');
    });

    it('keeps the error type of a failed add and says the attribute is missing when the rollback fails', async () => {
        // the POST mock answers 409 for both the new value and the rollback, so the rollback fails here
        mockRucio({ add: failure(409, 'Duplicate') });
        const res = await run();
        expect(res._getStatusCode()).toBe(409);
        const data: UpdateAccountAttributeViewModel = await res._getJSONData();
        expect(data.errorType).toBe('conflict');
        expect(data.message).toContain('is now missing');
        expect(data.message).not.toContain(EM_DASH);
    });

    it('reports a missing attribute as not_found', async () => {
        mockRucio({ existing: [{ key: 'other', value: 'x' }] });
        const res = await run();
        expect(res._getStatusCode()).toBe(404);
        const data: UpdateAccountAttributeViewModel = await res._getJSONData();
        expect(data.errorType).toBe('not_found');
        expect(data.message).toBe('Attribute k1 does not exist for this account.');
    });

    it('maps a refused delete to permission_denied', async () => {
        mockRucio({ del: failure(401, 'AccessDenied') });
        const res = await run();
        expect(res._getStatusCode()).toBe(401);
        expect(((await res._getJSONData()) as UpdateAccountAttributeViewModel).errorType).toBe('permission_denied');
    });
});

describe('Route: PUT /api/feature/update-account-attribute', () => {
    const call = async (body: unknown) => {
        const { route, execute } = loadRoute<typeof import('@/app/api/feature/update-account-attribute/route')>(
            '@/app/api/feature/update-account-attribute/route',
        );
        const response = (await route.PUT(jsonRequest('PUT', body))) as Response;
        return { response, execute };
    };

    it('passes valid params to the controller', async () => {
        const { response, execute } = await call({ account: 'jdoe', key: 'k1', value: 'v2' });
        expect(response.status).toBe(200);
        expect(execute).toHaveBeenCalledWith(expect.anything(), { account: 'jdoe', key: 'k1', value: 'v2' });
    });

    it.each([
        ['an invalid account', { account: 'Bad Name', key: 'k1', value: 'v' }],
        ['an invalid key', { account: 'jdoe', key: 'a b', value: 'v' }],
        ['an invalid value', { account: 'jdoe', key: 'k1', value: '' }],
        ['a missing value', { account: 'jdoe', key: 'k1' }],
        ['extra keys', { account: 'jdoe', key: 'k1', value: 'v', extra: 1 }],
    ])('returns 400 for %s', async (_name, body) => {
        const { response, execute } = await call(body);
        expect(response.status).toBe(400);
        expect(((await response.json()) as { errorType: string }).errorType).toBe('validation_error');
        expect(execute).not.toHaveBeenCalled();
    });
});
