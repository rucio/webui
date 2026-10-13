import { DeleteAccountIdentityRequest } from '@/lib/core/usecase-models/delete-account-identity-usecase-models';
import { DeleteAccountIdentityControllerParameters } from '@/lib/infrastructure/controller/delete-account-identity-controller';
import { DeleteAccountIdentityViewModel } from '@/lib/infrastructure/data/view-model/account';
import { IdentityType } from '@/lib/core/entity/account';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { jsonRequest, loadRoute } from './route-test-utils';

const EM_DASH = String.fromCharCode(0x2014);

describe('Feature: DeleteAccountIdentity', () => {
    beforeEach(() => {
        fetchMock.doMock();
    });

    afterEach(() => {
        fetchMock.dontMock();
        jest.restoreAllMocks();
    });

    const mockRucio = (status: number, exceptionClass?: string, requestValidator?: MockEndpoint['requestValidator']) => {
        const endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe/identities`,
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

    const run = async (overrides: Partial<DeleteAccountIdentityControllerParameters> = {}) => {
        const { res } = await createHttpMocks('/api/feature/delete-account-identity', 'DELETE', {});
        const controller = appContainer.get<BaseController<DeleteAccountIdentityControllerParameters, DeleteAccountIdentityRequest>>(
            CONTROLLERS.DELETE_ACCOUNT_IDENTITY,
        );
        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            account: 'jdoe',
            identity: 'jdoe',
            authType: IdentityType.USERPASS,
            ...overrides,
        });
        return res;
    };

    it('revokes the identity', async () => {
        let sent: unknown;
        mockRucio(200, undefined, async req => {
            sent = await req.json();
            return true;
        });
        const res = await run();
        expect(res._getStatusCode()).toBe(200);
        expect((await res._getJSONData()).status).toBe('success');
        expect(sent).toEqual({ identity: 'jdoe', authtype: 'USERPASS' });
    });

    it('reports a missing identity as not found', async () => {
        mockRucio(404, 'IdentityError');
        const res = await run();
        expect(res._getStatusCode()).toBe(404);
        const data: DeleteAccountIdentityViewModel = await res._getJSONData();
        expect(data.errorType).toBe('not_found');
        expect(data.message).toBe('The account was not found or is not active.');
        expect(data.message).not.toContain(EM_DASH);
    });
});

describe('Route: DELETE /api/feature/delete-account-identity', () => {
    const call = async (body: unknown) => {
        const { route, execute } = loadRoute<typeof import('@/app/api/feature/delete-account-identity/route')>(
            '@/app/api/feature/delete-account-identity/route',
        );
        const response = (await route.DELETE(jsonRequest('DELETE', body))) as Response;
        return { response, execute };
    };

    it('passes valid params to the controller', async () => {
        const { response, execute } = await call({ account: 'jdoe', identity: 'jdoe', authType: 'USERPASS' });
        expect(response.status).toBe(200);
        expect(execute).toHaveBeenCalledWith(expect.anything(), { account: 'jdoe', identity: 'jdoe', authType: 'USERPASS' });
    });

    it.each([
        ['an invalid account', { account: 'Bad Name', identity: 'jdoe', authType: 'USERPASS' }],
        ['an unknown auth type', { account: 'jdoe', identity: 'jdoe', authType: 'FOO' }],
        ['an empty identity', { account: 'jdoe', identity: '', authType: 'USERPASS' }],
        ['extra keys', { account: 'jdoe', identity: 'jdoe', authType: 'USERPASS', foo: 1 }],
    ])('returns 400 for %s', async (_name, body) => {
        const { response, execute } = await call(body);
        expect(response.status).toBe(400);
        expect(((await response.json()) as { errorType: string }).errorType).toBe('validation_error');
        expect(execute).not.toHaveBeenCalled();
    });
});
