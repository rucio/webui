import UpdateAccountAttributeUseCase from '@/lib/core/use-case/update-account-attribute-usecase';
import { BaseErrorResponseModel } from '@/lib/sdk/usecase-models';

const EM_DASH = String.fromCharCode(0x2014);
const ok = { status: 'success' };
const fail = (errorCode: number, errorClass = 'RucioException') => ({ status: 'error', errorCode, errorClass, errorMessage: 'boom', errorName: 'x' });

function setup(overrides: Record<string, jest.Mock> = {}, attributes: { key: string; value: string | boolean }[] = [{ key: 'k1', value: 'old' }]) {
    const calls: string[] = [];
    const gateway = {
        getAccountAttributes: jest.fn(async () => (calls.push('get'), { status: 'success', account: 'jdoe', attributes })),
        deleteAccountAttribute: jest.fn(async () => (calls.push('delete'), ok)),
        addAccountAttribute: jest.fn(async () => (calls.push('add'), ok)),
        ...overrides,
    };
    const errors: BaseErrorResponseModel[] = [];
    const successes: unknown[] = [];
    const presenter = {
        presentSuccess: async (r: unknown) => void successes.push(r),
        presentError: async (e: BaseErrorResponseModel) => void errors.push(e),
    };
    const useCase = new UpdateAccountAttributeUseCase(presenter as never, gateway as never);
    const run = (req: Record<string, unknown> = {}) => useCase.execute({ rucioAuthToken: 't', account: 'jdoe', key: 'k1', value: 'new', ...req } as never);
    return { gateway, errors, successes, run, calls };
}

describe('UpdateAccountAttributeUseCase', () => {
    it.each([
        ['account', { account: 'Bad Name' }],
        ['key', { key: 'a b' }],
        ['value', { value: '' }],
    ])('rejects an invalid %s before any gateway call', async (_n, req) => {
        const { gateway, errors, run } = setup();
        await run(req);
        expect(errors[0]).toMatchObject({ code: 400, name: 'ValidationError' });
        Object.values(gateway).forEach(fn => expect(fn).not.toHaveBeenCalled());
    });

    it('returns not_found without deleting when the key is missing', async () => {
        const { gateway, errors, run } = setup({}, [{ key: 'other', value: 'x' }]);
        await run();
        expect(errors[0]).toMatchObject({ code: 404, message: 'Attribute k1 does not exist for this account.' });
        expect(gateway.deleteAccountAttribute).not.toHaveBeenCalled();
        expect(gateway.addAccountAttribute).not.toHaveBeenCalled();
    });

    it('returns the read error when the attributes cannot be read', async () => {
        const { gateway, errors, run } = setup({ getAccountAttributes: jest.fn(async () => fail(404, 'AccountNotFound')) });
        await run();
        expect(errors[0]).toMatchObject({ code: 404, name: 'AccountNotFound' });
        expect(gateway.deleteAccountAttribute).not.toHaveBeenCalled();
    });

    it('succeeds without calling Rucio when the value is unchanged', async () => {
        const { gateway, successes, errors, run } = setup();
        await run({ value: 'old' });
        expect(successes).toHaveLength(1);
        expect(errors).toHaveLength(0);
        expect(gateway.deleteAccountAttribute).not.toHaveBeenCalled();
        expect(gateway.addAccountAttribute).not.toHaveBeenCalled();
    });

    it('treats a boolean current value as its string form when comparing', async () => {
        const { gateway, successes, run } = setup({}, [{ key: 'k1', value: true }]);
        await run({ value: 'True' });
        expect(successes).toHaveLength(1);
        expect(gateway.deleteAccountAttribute).not.toHaveBeenCalled();
    });

    it('deletes then adds the new value', async () => {
        const { gateway, successes, errors, run, calls } = setup();
        await run();
        expect(calls).toEqual(['get', 'delete', 'add']);
        expect(gateway.deleteAccountAttribute).toHaveBeenCalledWith('t', 'jdoe', 'k1');
        expect(gateway.addAccountAttribute).toHaveBeenCalledWith('t', 'jdoe', 'k1', 'new');
        expect(successes).toEqual([{ status: 'success' }]);
        expect(errors).toHaveLength(0);
    });

    it('restores the previous value when the add fails', async () => {
        const add = jest.fn().mockResolvedValueOnce(fail(500, 'InvalidObject')).mockResolvedValueOnce(ok);
        const { errors, run } = setup({ addAccountAttribute: add });
        await run();
        expect(add).toHaveBeenNthCalledWith(2, 't', 'jdoe', 'k1', 'old');
        expect(errors[0]).toMatchObject({
            code: 500,
            name: 'InvalidObject',
            message: 'The new value could not be saved. The previous value was restored.',
        });
        expect(errors[0].message).toContain('previous value was restored');
    });

    it('restores a boolean previous value in its string form', async () => {
        const add = jest.fn().mockResolvedValueOnce(fail(500)).mockResolvedValueOnce(ok);
        const { run } = setup({ addAccountAttribute: add }, [{ key: 'k1', value: false }]);
        await run();
        expect(add).toHaveBeenNthCalledWith(2, 't', 'jdoe', 'k1', 'False');
    });

    it('reports a missing attribute when the rollback fails too', async () => {
        const add = jest.fn().mockResolvedValue(fail(500));
        const { errors, run } = setup({ addAccountAttribute: add });
        await run();
        expect(add).toHaveBeenCalledTimes(2);
        expect(errors[0].message).toContain('is now missing');
        expect(errors[0].message).toContain('k1');
        expect(errors[0].message).not.toContain(EM_DASH);
    });

    it('reports a missing attribute when the rollback throws', async () => {
        const add = jest.fn().mockResolvedValueOnce(fail(500)).mockRejectedValueOnce(new Error('network'));
        const { errors, run } = setup({ addAccountAttribute: add });
        await run();
        expect(errors[0].message).toContain('is now missing');
    });

    it('returns the delete error and does not add when the delete fails', async () => {
        const { gateway, errors, run } = setup({ deleteAccountAttribute: jest.fn(async () => fail(403, 'AccessDenied')) });
        await run();
        expect(errors[0]).toMatchObject({ code: 403, name: 'AccessDenied', message: 'boom' });
        expect(gateway.addAccountAttribute).not.toHaveBeenCalled();
    });
});
