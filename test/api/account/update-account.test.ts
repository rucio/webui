import { UpdateAccountRequest } from '@/lib/core/usecase-models/update-account-usecase-models';
import { UpdateAccountControllerParameters } from '@/lib/infrastructure/controller/update-account-controller';
import { UpdateAccountViewModel } from '@/lib/infrastructure/data/view-model/account';
import { AccountStatus, AccountType } from '@/lib/core/entity/rucio';
import { AccountUpdateOptions } from '@/lib/core/entity/account';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { jsonRequest, loadRoute } from './route-test-utils';

describe('Feature: UpdateAccount', () => {
    beforeEach(() => {
        fetchMock.doMock();
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    const mockRucio = (status: number, exceptionClass?: string, requestValidator?: MockEndpoint['requestValidator']) => {
        const endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe`,
            method: 'PUT',
            response: {
                status,
                headers: { 'Content-Type': 'application/json', ...(exceptionClass ? { ExceptionClass: exceptionClass } : {}) },
                body: status < 300 ? '' : JSON.stringify({ ExceptionMessage: 'nope', ...(exceptionClass ? { ExceptionClass: exceptionClass } : {}) }),
            },
            requestValidator,
        };
        MockRucioServerFactory.createMockRucioServer(true, [endpoint]);
    };

    const run = async (options: AccountUpdateOptions) => {
        const { res } = await createHttpMocks('/api/feature/update-account', 'PUT', {});
        const controller = appContainer.get<BaseController<UpdateAccountControllerParameters, UpdateAccountRequest>>(CONTROLLERS.UPDATE_ACCOUNT);
        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            account: 'jdoe',
            options,
        });
        return res;
    };

    it('suspends the account and sends only the status', async () => {
        let sent: unknown;
        mockRucio(200, undefined, async req => {
            sent = await req.json();
            return true;
        });
        const res = await run({ status: AccountStatus.SUSPENDED });
        expect(res._getStatusCode()).toBe(200);
        expect((await res._getJSONData()).status).toBe('success');
        expect(sent).toEqual({ status: 'SUSPENDED' });
    });

    it('sends email and account type together', async () => {
        let sent: unknown;
        mockRucio(200, undefined, async req => {
            sent = await req.json();
            return true;
        });
        await run({ email: 'new@example.org', accountType: AccountType.SERVICE });
        expect(sent).toEqual({ email: 'new@example.org', account_type: 'SERVICE' });
    });

    it.each([
        [404, 'AccountNotFound', 'not_found'],
        [401, 'AccessDenied', 'permission_denied'],
        [401, 'CannotAuthenticate', 'unauthorized'],
        [500, 'InvalidObject', 'validation_error'],
    ])('maps gateway status %s (%s) to errorType %s', async (status, exceptionClass, errorType) => {
        mockRucio(status, exceptionClass);
        const res = await run({ email: 'new@example.org' });
        expect(res._getStatusCode()).toBe(status);
        const data: UpdateAccountViewModel = await res._getJSONData();
        expect(data.status).toBe('error');
        expect(data.errorType).toBe(errorType);
    });

    it('uses the account-not-found message for a 404', async () => {
        mockRucio(404, 'AccountNotFound');
        const data: UpdateAccountViewModel = await (await run({ email: 'new@example.org' }))._getJSONData();
        expect(data.message).toBe('The account was not found or is not active.');
    });
});

describe('Route: PUT /api/feature/update-account', () => {
    const put = async (body: unknown) => {
        const { route, execute } = loadRoute<typeof import('@/app/api/feature/update-account/route')>('@/app/api/feature/update-account/route');
        const response = (await route.PUT(jsonRequest('PUT', body))) as Response;
        return { response, execute };
    };

    it.each([[{ status: 'SUSPENDED' }], [{ status: 'ACTIVE' }], [{ email: null }], [{ email: 'a@b.org', accountType: 'GROUP' }]])(
        'passes %j to the controller',
        async options => {
            const { response, execute } = await put({ account: 'jdoe', options });
            expect(response.status).toBe(200);
            expect(execute).toHaveBeenCalledWith(expect.anything(), { account: 'jdoe', options });
        },
    );

    it.each([
        ['status DELETED', { account: 'jdoe', options: { status: 'DELETED' } }],
        ['an unknown option', { account: 'jdoe', options: { foo: 1 } }],
        ['empty options', { account: 'jdoe', options: {} }],
        ['an invalid email', { account: 'jdoe', options: { email: 'nope' } }],
        ['an invalid account name', { account: 'Bad Name', options: { status: 'ACTIVE' } }],
        ['missing options', { account: 'jdoe' }],
    ])('returns 400 for %s', async (_name, body) => {
        const { response, execute } = await put(body);
        expect(response.status).toBe(400);
        expect(execute).not.toHaveBeenCalled();
    });
});
