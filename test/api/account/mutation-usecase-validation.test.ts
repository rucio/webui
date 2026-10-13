import CreateAccountUseCase from '@/lib/core/use-case/create-account-usecase';
import UpdateAccountUseCase from '@/lib/core/use-case/update-account-usecase';
import DeleteAccountUseCase from '@/lib/core/use-case/delete-account-usecase';
import AddAccountAttributeUseCase from '@/lib/core/use-case/add-account-attribute-usecase';
import DeleteAccountAttributeUseCase from '@/lib/core/use-case/delete-account-attribute-usecase';
import UpdateAccountAttributeUseCase from '@/lib/core/use-case/update-account-attribute-usecase';
import AddAccountIdentityUseCase from '@/lib/core/use-case/add-account-identity-usecase';
import DeleteAccountIdentityUseCase from '@/lib/core/use-case/delete-account-identity-usecase';
import SetAccountLimitUseCase from '@/lib/core/use-case/set-account-limit-usecase';
import DeleteAccountLimitUseCase from '@/lib/core/use-case/delete-account-limit-usecase';
import CreateAccountPresenter from '@/lib/infrastructure/presenter/create-account-presenter';
import { BaseErrorResponseModel } from '@/lib/sdk/usecase-models';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import { NextApiResponse } from 'next';

// The mutation use cases re-check the domain rules that zod enforces at the routes, so callers that
// bypass the routes get a ValidationError (400) and Rucio is never called.

type UseCaseClass = new (presenter: any, gateway: any) => { execute: (request: any) => Promise<void> };

const gatewayStub = () =>
    new Proxy({} as Record<string, jest.Mock>, {
        get: (target, prop: string) => (target[prop] ??= jest.fn().mockResolvedValue({ status: 'success' })),
    });

async function run(UseCase: UseCaseClass, request: Record<string, unknown>) {
    const errors: BaseErrorResponseModel[] = [];
    const successes: unknown[] = [];
    const presenter = {
        presentSuccess: async (r: unknown) => void successes.push(r),
        presentError: async (e: BaseErrorResponseModel) => void errors.push(e),
    };
    const gateway = gatewayStub();
    await new UseCase(presenter, gateway).execute({ rucioAuthToken: 'token', ...request });
    const gatewayCalls = Object.values(gateway as Record<string, jest.Mock>).reduce((n, fn) => n + fn.mock.calls.length, 0);
    return { errors, successes, gatewayCalls };
}

const invalid: [string, UseCaseClass, Record<string, unknown>, RegExp][] = [
    ['CreateAccount rejects an invalid name', CreateAccountUseCase, { account: 'Bad Name', accountType: 'USER', email: null }, /account name/i],
    ['CreateAccount rejects an invalid email', CreateAccountUseCase, { account: 'jdoe', accountType: 'USER', email: 'nope' }, /email/i],
    ['CreateAccount rejects an unknown type', CreateAccountUseCase, { account: 'jdoe', accountType: 'UNKNOWN', email: null }, /type/i],
    ['UpdateAccount rejects empty options', UpdateAccountUseCase, { account: 'jdoe', options: {} }, /at least one/i],
    ['UpdateAccount rejects an unknown option', UpdateAccountUseCase, { account: 'jdoe', options: { foo: 1 } }, /can be updated/i],
    ['UpdateAccount rejects a DELETED status', UpdateAccountUseCase, { account: 'jdoe', options: { status: 'DELETED' } }, /status/i],
    ['UpdateAccount rejects an invalid email', UpdateAccountUseCase, { account: 'jdoe', options: { email: 'nope' } }, /email/i],
    ['UpdateAccount rejects an invalid type', UpdateAccountUseCase, { account: 'jdoe', options: { accountType: 'ROBOT' } }, /type/i],
    ['UpdateAccount rejects an invalid name', UpdateAccountUseCase, { account: 'J.Doe', options: { email: null } }, /account name/i],
    ['DeleteAccount rejects an invalid name', DeleteAccountUseCase, { account: '' }, /account name/i],
    ['AddAccountAttribute rejects an invalid key', AddAccountAttributeUseCase, { account: 'jdoe', key: 'a b', value: 'x' }, /key/i],
    ['AddAccountAttribute rejects an invalid value', AddAccountAttributeUseCase, { account: 'jdoe', key: 'admin', value: '' }, /value/i],
    ['DeleteAccountAttribute rejects an invalid key', DeleteAccountAttributeUseCase, { account: 'jdoe', key: 'a'.repeat(31) }, /key/i],
    ['UpdateAccountAttribute rejects an invalid value', UpdateAccountAttributeUseCase, { account: 'jdoe', key: 'k1', value: 'a b' }, /value/i],
    [
        'AddAccountIdentity rejects an empty identity',
        AddAccountIdentityUseCase,
        { account: 'jdoe', identity: '  ', authType: 'USERPASS', email: 'jdoe@example.org' },
        /identity/i,
    ],
    [
        'AddAccountIdentity rejects the UNKNOWN type',
        AddAccountIdentityUseCase,
        { account: 'jdoe', identity: 'jdoe', authType: 'UNKNOWN', email: 'jdoe@example.org' },
        /identity type/i,
    ],
    [
        'AddAccountIdentity rejects an invalid email',
        AddAccountIdentityUseCase,
        { account: 'jdoe', identity: 'jdoe', authType: 'X509', email: 'nope' },
        /email/i,
    ],
    [
        'DeleteAccountIdentity rejects an empty identity',
        DeleteAccountIdentityUseCase,
        { account: 'jdoe', identity: '', authType: 'X509' },
        /identity/i,
    ],
    [
        'DeleteAccountIdentity rejects the UNKNOWN type',
        DeleteAccountIdentityUseCase,
        { account: 'jdoe', identity: 'CN=x', authType: 'UNKNOWN' },
        /identity type/i,
    ],
    [
        'SetAccountLimit rejects bytes below -1',
        SetAccountLimitUseCase,
        { account: 'jdoe', locality: 'local', rseExpression: 'XRD1', bytes: -2 },
        /bytes/i,
    ],
    [
        'SetAccountLimit rejects fractional bytes',
        SetAccountLimitUseCase,
        { account: 'jdoe', locality: 'local', rseExpression: 'XRD1', bytes: 1.5 },
        /bytes/i,
    ],
    [
        'SetAccountLimit rejects an empty RSE expression',
        SetAccountLimitUseCase,
        { account: 'jdoe', locality: 'global', rseExpression: '', bytes: 10 },
        /rse expression/i,
    ],
    [
        'DeleteAccountLimit rejects an empty RSE expression',
        DeleteAccountLimitUseCase,
        { account: 'jdoe', locality: 'local', rseExpression: ' ' },
        /rse expression/i,
    ],
    [
        'DeleteAccountLimit rejects an invalid name',
        DeleteAccountLimitUseCase,
        { account: 'J', locality: 'local', rseExpression: 'XRD1' },
        /account name/i,
    ],
];

describe('Account mutation use case validation', () => {
    it.each(invalid)('%s', async (_name, UseCase, request, message) => {
        const { errors, successes, gatewayCalls } = await run(UseCase, request);
        expect(successes).toHaveLength(0);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toMatchObject({ status: 'error', code: 400, name: 'ValidationError' });
        expect(errors[0].message).toMatch(message);
        expect(gatewayCalls).toBe(0);
    });

    const valid: [string, UseCaseClass, Record<string, unknown>][] = [
        ['CreateAccount with a null email', CreateAccountUseCase, { account: 'jdoe', accountType: 'USER', email: null }],
        ['UpdateAccount clearing the email', UpdateAccountUseCase, { account: 'jdoe', options: { email: null } }],
        ['UpdateAccount suspending', UpdateAccountUseCase, { account: 'jdoe', options: { status: 'SUSPENDED' } }],
        // An existing USERPASS username needs no password.
        [
            'AddAccountIdentity USERPASS without a password',
            AddAccountIdentityUseCase,
            { account: 'jdoe', identity: 'jdoe', authType: 'USERPASS', email: 'a@b.c' },
        ],
        ['SetAccountLimit unlimited', SetAccountLimitUseCase, { account: 'jdoe', locality: 'local', rseExpression: 'XRD1', bytes: -1 }],
    ];

    it.each(valid)('accepts %s', async (_name, UseCase, request) => {
        const { errors, gatewayCalls } = await run(UseCase, request);
        expect(errors).toHaveLength(0);
        expect(gatewayCalls).toBe(1);
    });

    it('is presented as validation_error', async () => {
        const { res } = await createHttpMocks('/api/feature/create-account', 'POST', {});
        const presenter = new CreateAccountPresenter(res as unknown as NextApiResponse);
        await new CreateAccountUseCase(presenter, gatewayStub()).execute({
            rucioAuthToken: 'token',
            account: 'Bad Name',
            accountType: 'USER',
            email: null,
        } as any);
        expect(res._getStatusCode()).toBe(400);
        expect(await res._getJSONData()).toMatchObject({ status: 'error', errorType: 'validation_error', message: 'Invalid account name' });
    });
});
