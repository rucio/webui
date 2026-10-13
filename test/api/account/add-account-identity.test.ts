import { AddAccountIdentityRequest } from '@/lib/core/usecase-models/add-account-identity-usecase-models';
import { AddAccountIdentityControllerParameters } from '@/lib/infrastructure/controller/add-account-identity-controller';
import { AddAccountIdentityViewModel } from '@/lib/infrastructure/data/view-model/account';
import { IdentityType } from '@/lib/core/entity/account';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { jsonRequest, loadRoute } from './route-test-utils';

const EM_DASH = String.fromCharCode(0x2014);
const SECRET = 's3cr3t-p4ssw0rd-do-not-log';

describe('Feature: AddAccountIdentity', () => {
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

    const run = async (overrides: Partial<AddAccountIdentityControllerParameters> = {}) => {
        const { res } = await createHttpMocks('/api/feature/add-account-identity', 'POST', {});
        const controller = appContainer.get<BaseController<AddAccountIdentityControllerParameters, AddAccountIdentityRequest>>(
            CONTROLLERS.ADD_ACCOUNT_IDENTITY,
        );
        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            account: 'jdoe',
            identity: 'jdoe',
            authType: IdentityType.USERPASS,
            email: 'jdoe@example.org',
            password: SECRET,
            isDefault: false,
            ...overrides,
        });
        return res;
    };

    it('adds the identity and sends the password to Rucio', async () => {
        let sent: unknown;
        mockRucio(201, undefined, async req => {
            sent = await req.json();
            return true;
        });
        const res = await run();
        expect(res._getStatusCode()).toBe(200);
        expect((await res._getJSONData()).status).toBe('success');
        expect(sent).toEqual({ identity: 'jdoe', authtype: 'USERPASS', email: 'jdoe@example.org', default: false, password: SECRET });
    });

    it('omits the password when none is given', async () => {
        let sent: Record<string, unknown> = {};
        mockRucio(201, undefined, async req => {
            sent = await req.json();
            return true;
        });
        await run({ password: undefined, isDefault: true });
        expect(sent).toEqual({ identity: 'jdoe', authtype: 'USERPASS', email: 'jdoe@example.org', default: true });
    });

    it('reports an identity that is already mapped', async () => {
        mockRucio(409, 'Duplicate');
        const res = await run();
        expect(res._getStatusCode()).toBe(409);
        const data: AddAccountIdentityViewModel = await res._getJSONData();
        expect(data.errorType).toBe('conflict');
        expect(data.message).toBe('This identity is already mapped to the account.');
        expect(data.message).not.toContain(EM_DASH);
    });

    it('maps a Rucio IdentityError to a validation error', async () => {
        mockRucio(400, 'IdentityError');
        const res = await run();
        expect(res._getStatusCode()).toBe(400);
        const data: AddAccountIdentityViewModel = await res._getJSONData();
        expect(data.errorType).toBe('validation_error');
        expect(data.message).toBe('nope');
        expect(data.message).not.toContain(EM_DASH);
    });

    it('never logs the password when the request fails', async () => {
        const spies = [jest.spyOn(console, 'error'), jest.spyOn(console, 'log'), jest.spyOn(console, 'warn')].map(spy =>
            spy.mockImplementation(() => {}),
        );
        mockRucio(400, 'IdentityError');
        await run();
        const logged = spies.flatMap(spy => spy.mock.calls.flat()).map(arg => (typeof arg === 'string' ? arg : JSON.stringify(arg) ?? String(arg)));
        expect(logged.some(entry => entry.includes(SECRET))).toBe(false);
    });
});

describe('Route: POST /api/feature/add-account-identity', () => {
    const call = async (body: unknown) => {
        const { route, execute } = loadRoute<typeof import('@/app/api/feature/add-account-identity/route')>(
            '@/app/api/feature/add-account-identity/route',
        );
        const response = (await route.POST(jsonRequest('POST', body))) as Response;
        return { response, execute };
    };

    it('passes valid params to the controller', async () => {
        const { response, execute } = await call({
            account: 'jdoe',
            identity: 'jdoe',
            authType: 'USERPASS',
            email: 'jdoe@example.org',
            password: 'hunter2',
        });
        expect(response.status).toBe(200);
        expect(execute).toHaveBeenCalledWith(expect.anything(), {
            account: 'jdoe',
            identity: 'jdoe',
            authType: 'USERPASS',
            email: 'jdoe@example.org',
            password: 'hunter2',
        });
    });

    it.each([
        ['an invalid account', { account: 'Bad Name', identity: 'jdoe', authType: 'USERPASS', email: 'a@b.org' }],
        ['an unknown auth type', { account: 'jdoe', identity: 'jdoe', authType: 'FOO', email: 'a@b.org' }],
        ['UNKNOWN auth type', { account: 'jdoe', identity: 'jdoe', authType: 'UNKNOWN', email: 'a@b.org' }],
        ['an empty identity', { account: 'jdoe', identity: '   ', authType: 'USERPASS', email: 'a@b.org' }],
        ['an invalid email', { account: 'jdoe', identity: 'jdoe', authType: 'USERPASS', email: 'nope' }],
        ['an empty password', { account: 'jdoe', identity: 'jdoe', authType: 'USERPASS', email: 'a@b.org', password: '' }],
        ['extra keys', { account: 'jdoe', identity: 'jdoe', authType: 'USERPASS', email: 'a@b.org', foo: 1 }],
    ])('returns 400 for %s', async (_name, body) => {
        const { response, execute } = await call(body);
        expect(response.status).toBe(400);
        expect(((await response.json()) as { errorType: string }).errorType).toBe('validation_error');
        expect(execute).not.toHaveBeenCalled();
    });
});
