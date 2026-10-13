import { QueryClient } from '@tanstack/react-query';
import { invalidateForMutation } from '@/lib/infrastructure/query/invalidate-for-mutation';
import { INVALIDATION_MAP } from '@/lib/infrastructure/query/invalidation-map';
import { accountKeys, QUERY_KEYS } from '@/lib/infrastructure/query/query-keys';
import { accountQueryDefaults } from '@/lib/infrastructure/query/account-query-options';

describe('invalidateForMutation', () => {
    const setup = () => {
        const queryClient = new QueryClient();
        const spy = jest.spyOn(queryClient, 'invalidateQueries').mockResolvedValue(undefined);
        return { queryClient, spy };
    };

    it('passes the mutation variables to function entries', () => {
        const { queryClient, spy } = setup();
        invalidateForMutation(queryClient, 'add-account-identity', { account: 'jdoe' });
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ queryKey: ['account', 'jdoe', 'identities'] });
    });

    it('still resolves plain tuple entries', () => {
        const { queryClient, spy } = setup();
        invalidateForMutation(queryClient, 'update-rule');
        expect(spy).toHaveBeenCalledWith({ queryKey: ['rule-meta'] });
        expect(spy).toHaveBeenCalledWith({ queryKey: ['rule-page'] });
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('is a no-op for an unknown mutation', () => {
        const { queryClient, spy } = setup();
        invalidateForMutation(queryClient, 'does-not-exist', { account: 'jdoe' });
        expect(spy).not.toHaveBeenCalled();
    });

    it('update-account invalidates info for email/type changes and for a suspend', () => {
        const { queryClient, spy } = setup();
        invalidateForMutation(queryClient, 'update-account', { account: 'jdoe', options: { email: 'a@b.c' } });
        expect(spy).toHaveBeenLastCalledWith({ queryKey: ['account', 'jdoe', 'info'] });
        // The sub-resource queries must not be invalidated on suspend: they are still enabled and would
        // refetch, and Rucio answers 404 for them once the account is suspended.
        invalidateForMutation(queryClient, 'update-account', { account: 'jdoe', options: { status: 'SUSPENDED' } });
        expect(spy).toHaveBeenLastCalledWith({ queryKey: ['account', 'jdoe', 'info'] });
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('update-account invalidates the whole account for a reactivate', () => {
        const { queryClient, spy } = setup();
        invalidateForMutation(queryClient, 'update-account', { account: 'jdoe', options: { status: 'ACTIVE' } });
        expect(spy).toHaveBeenCalledWith({ queryKey: ['account', 'jdoe'] });
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('resolves once the invalidations have settled', async () => {
        const { queryClient, spy } = setup();
        let settle: () => void = () => {};
        spy.mockImplementationOnce(() => new Promise<void>(r => (settle = r)));
        let done = false;
        const pending = invalidateForMutation(queryClient, 'update-account', { account: 'jdoe', options: { status: 'SUSPENDED' } }).then(() => {
            done = true;
        });
        await Promise.resolve();
        expect(done).toBe(false);
        settle();
        await pending;
        expect(done).toBe(true);
    });

    it.each([
        ['add-account-attribute', 'attributes'],
        ['update-account-attribute', 'attributes'],
        ['delete-account-attribute', 'attributes'],
        ['add-account-identity', 'identities'],
        ['delete-account-identity', 'identities'],
        ['set-account-limit', 'quotas'],
        ['delete-account-limit', 'quotas'],
    ])('%s invalidates the account %s query', (name, suffix) => {
        const { queryClient, spy } = setup();
        invalidateForMutation(queryClient, name, { account: 'jdoe' });
        expect(spy).toHaveBeenCalledWith({ queryKey: ['account', 'jdoe', suffix] });
    });

    it('registers every account mutation, with create and delete invalidating nothing', () => {
        [
            'create-account',
            'update-account',
            'delete-account',
            'add-account-attribute',
            'update-account-attribute',
            'delete-account-attribute',
            'add-account-identity',
            'delete-account-identity',
            'set-account-limit',
            'delete-account-limit',
        ].forEach(name => expect(INVALIDATION_MAP[name]).toBeDefined());
        const { queryClient, spy } = setup();
        invalidateForMutation(queryClient, 'create-account', { account: 'jdoe' });
        invalidateForMutation(queryClient, 'delete-account', { account: 'jdoe' });
        expect(spy).not.toHaveBeenCalled();
    });
});

describe('accountKeys', () => {
    it('builds prefix-compatible keys', () => {
        expect(accountKeys.all).toEqual(QUERY_KEYS.ACCOUNT);
        expect(accountKeys.detail('jdoe')).toEqual(['account', 'jdoe']);
        expect(accountKeys.info('jdoe')).toEqual(['account', 'jdoe', 'info']);
        expect(accountKeys.quotas('jdoe')).toEqual(['account', 'jdoe', 'quotas']);
    });
});

describe('accountQueryDefaults.retry', () => {
    it('retries unknown errors twice', () => {
        expect(accountQueryDefaults.retry(0, { errorType: 'unknown' })).toBe(true);
        expect(accountQueryDefaults.retry(1, { errorType: 'unknown' })).toBe(true);
        expect(accountQueryDefaults.retry(2, { errorType: 'unknown' })).toBe(false);
    });

    it.each(['not_found', 'permission_denied', 'conflict', 'unauthorized', 'validation_error'] as const)('never retries %s', errorType => {
        expect(accountQueryDefaults.retry(0, { errorType })).toBe(false);
    });
});
