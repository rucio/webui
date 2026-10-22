import { CreateAccountRequest } from '@/lib/core/usecase-models/create-account-usecase-models';
import { CreateAccountControllerParameters } from '@/lib/infrastructure/controller/create-account-controller';
import { CreateAccountViewModel } from '@/lib/infrastructure/data/view-model/account';
import { AccountType } from '@/lib/core/entity/rucio';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { jsonRequest, loadRoute } from './route-test-utils';

const EM_DASH = String.fromCharCode(0x2014);

describe('Feature: CreateAccount', () => {
    beforeEach(() => {
        fetchMock.doMock();
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    const mockRucio = (status: number, exceptionClass?: string, requestValidator?: MockEndpoint['requestValidator']) => {
        const endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe`,
            method: 'POST',
            response: {
                status,
                headers: { 'Content-Type': 'application/json', ...(exceptionClass ? { ExceptionClass: exceptionClass } : {}) },
                body:
                    status < 300
                        ? 'Created'
                        : JSON.stringify({ ExceptionMessage: 'nope', ...(exceptionClass ? { ExceptionClass: exceptionClass } : {}) }),
            },
            requestValidator,
        };
        MockRucioServerFactory.createMockRucioServer(true, [endpoint]);
    };

    const run = async (email: string | null = 'jdoe@example.org') => {
        const { res } = await createHttpMocks('/api/feature/create-account', 'POST', {});
        const controller = appContainer.get<BaseController<CreateAccountControllerParameters, CreateAccountRequest>>(CONTROLLERS.CREATE_ACCOUNT);
        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            account: 'jdoe',
            accountType: AccountType.USER,
            email,
        });
        return res;
    };

    it('creates the account and returns its name', async () => {
        let sent: unknown;
        mockRucio(201, undefined, async req => {
            sent = await req.json();
            return true;
        });
        const res = await run();
        expect(res._getStatusCode()).toBe(200);
        const data: CreateAccountViewModel = await res._getJSONData();
        expect(data).toMatchObject({ status: 'success', account: 'jdoe' });
        expect(sent).toEqual({ type: 'USER', email: 'jdoe@example.org' });
    });

    it('sends a null email explicitly', async () => {
        let sent: unknown;
        mockRucio(201, undefined, async req => {
            sent = await req.json();
            return true;
        });
        await run(null);
        expect(sent).toEqual({ type: 'USER', email: null });
    });

    it('explains that only root can create accounts when Rucio answers AccessDenied', async () => {
        mockRucio(401, 'AccessDenied');
        const res = await run();
        expect(res._getStatusCode()).toBe(401);
        const data: CreateAccountViewModel = await res._getJSONData();
        expect(data.status).toBe('error');
        expect(data.errorType).toBe('permission_denied');
        expect(data.message).toBe('Only the root account can create or delete accounts on this Rucio server.');
        expect(data.message).not.toContain(EM_DASH);
    });

    it('reports a name conflict', async () => {
        mockRucio(409, 'Duplicate');
        const res = await run();
        expect(res._getStatusCode()).toBe(409);
        const data: CreateAccountViewModel = await res._getJSONData();
        expect(data.errorType).toBe('conflict');
        expect(data.message).toBe('An account with this name exists or existed before. Deleted account names cannot be reused.');
    });

    it('maps an expired session to unauthorized', async () => {
        mockRucio(401, 'CannotAuthenticate');
        const res = await run();
        expect((await res._getJSONData()).errorType).toBe('unauthorized');
    });
});

describe('Route: POST /api/feature/create-account', () => {
    const post = async (body: unknown) => {
        const { route, execute } = loadRoute<typeof import('@/app/api/feature/create-account/route')>('@/app/api/feature/create-account/route');
        const response = await route.POST(jsonRequest('POST', body));
        return { response: response as Response, execute };
    };

    it('passes valid params to the controller', async () => {
        const { response, execute } = await post({ account: 'jdoe', accountType: 'SERVICE', email: null });
        expect(response.status).toBe(200);
        expect(execute).toHaveBeenCalledWith(expect.anything(), { account: 'jdoe', accountType: 'SERVICE', email: null });
    });

    it.each([
        ['an invalid name', { account: 'Bad Name', accountType: 'USER', email: null }],
        ['an unknown type', { account: 'jdoe', accountType: 'ROBOT', email: null }],
        ['UNKNOWN type', { account: 'jdoe', accountType: 'UNKNOWN', email: null }],
        ['an invalid email', { account: 'jdoe', accountType: 'USER', email: 'nope' }],
        ['a missing email', { account: 'jdoe', accountType: 'USER' }],
        ['extra keys', { account: 'jdoe', accountType: 'USER', email: null, foo: 1 }],
    ])('returns 400 for %s', async (_name, body) => {
        const { response, execute } = await post(body);
        expect(response.status).toBe(400);
        expect(((await response.json()) as { errorType: string }).errorType).toBe('validation_error');
        expect(execute).not.toHaveBeenCalled();
    });
});
