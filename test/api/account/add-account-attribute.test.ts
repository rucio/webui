import { AddAccountAttributeRequest } from '@/lib/core/usecase-models/add-account-attribute-usecase-models';
import { AddAccountAttributeControllerParameters } from '@/lib/infrastructure/controller/add-account-attribute-controller';
import { AddAccountAttributeViewModel } from '@/lib/infrastructure/data/view-model/account';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { jsonRequest, loadRoute } from './route-test-utils';

const EM_DASH = String.fromCharCode(0x2014);

describe('Feature: AddAccountAttribute', () => {
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

    const run = async (overrides: Partial<AddAccountAttributeControllerParameters> = {}) => {
        const { res } = await createHttpMocks('/api/feature/add-account-attribute', 'POST', {});
        const controller = appContainer.get<BaseController<AddAccountAttributeControllerParameters, AddAccountAttributeRequest>>(
            CONTROLLERS.ADD_ACCOUNT_ATTRIBUTE,
        );
        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            account: 'jdoe',
            key: 'k1',
            value: 'v1',
            ...overrides,
        });
        return res;
    };

    it('adds the attribute', async () => {
        let sent: unknown;
        mockRucio(201, undefined, async req => {
            sent = await req.json();
            return true;
        });
        const res = await run();
        expect(res._getStatusCode()).toBe(200);
        expect((await res._getJSONData()).status).toBe('success');
        expect(sent).toEqual({ value: 'v1' });
    });

    it('reports an existing attribute as a conflict', async () => {
        mockRucio(409, 'Duplicate');
        const res = await run();
        expect(res._getStatusCode()).toBe(409);
        const data: AddAccountAttributeViewModel = await res._getJSONData();
        expect(data.errorType).toBe('conflict');
        expect(data.message).toBe('This attribute already exists. Delete it first to change its value.');
        expect(data.message).not.toContain(EM_DASH);
    });

    it('reports a missing account', async () => {
        mockRucio(404, 'AccountNotFound');
        const res = await run();
        expect(res._getStatusCode()).toBe(404);
        const data: AddAccountAttributeViewModel = await res._getJSONData();
        expect(data.errorType).toBe('not_found');
        expect(data.message).toBe('The account was not found or is not active.');
        expect(data.message).not.toContain(EM_DASH);
    });

    it('reports a permission error', async () => {
        mockRucio(401, 'AccessDenied');
        const res = await run();
        expect(res._getStatusCode()).toBe(401);
        const data: AddAccountAttributeViewModel = await res._getJSONData();
        expect(data.errorType).toBe('permission_denied');
        expect(data.message).toBe('You do not have permission to do this. Your admin role may have changed; try signing in again.');
        expect(data.message).not.toContain(EM_DASH);
    });
});

describe('Route: POST /api/feature/add-account-attribute', () => {
    const call = async (body: unknown) => {
        const { route, execute } = loadRoute<typeof import('@/app/api/feature/add-account-attribute/route')>(
            '@/app/api/feature/add-account-attribute/route',
        );
        const response = (await route.POST(jsonRequest('POST', body))) as Response;
        return { response, execute };
    };

    it('passes valid params to the controller', async () => {
        const { response, execute } = await call({ account: 'jdoe', key: 'k1', value: 'v1' });
        expect(response.status).toBe(200);
        expect(execute).toHaveBeenCalledWith(expect.anything(), { account: 'jdoe', key: 'k1', value: 'v1' });
    });

    it.each([
        ['an invalid account', { account: 'Bad Name', key: 'k1', value: 'v1' }],
        ['a key with a space', { account: 'jdoe', key: 'a b', value: 'v1' }],
        ['a value with a space', { account: 'jdoe', key: 'k1', value: 'a b' }],
        ['a missing value', { account: 'jdoe', key: 'k1' }],
        ['extra keys', { account: 'jdoe', key: 'k1', value: 'v1', foo: 1 }],
    ])('returns 400 for %s', async (_name, body) => {
        const { response, execute } = await call(body);
        expect(response.status).toBe(400);
        expect(((await response.json()) as { errorType: string }).errorType).toBe('validation_error');
        expect(execute).not.toHaveBeenCalled();
    });
});
