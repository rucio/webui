import { AccountMutationViewModel } from '@/lib/infrastructure/data/view-model/account';

/**
 * Fetches a JSON view model and throws it when the request or the view model failed, so React Query
 * hands it to `onError` / `error`. A body that is not JSON (e.g. a Rucio 500 text/html page) becomes
 * an `unknown` error view model.
 */
export const fetchViewModel = async <T extends { status: string }>(url: string, init?: RequestInit): Promise<T> => {
    const res = await fetch(url, init);
    let vm: T;
    try {
        vm = await res.json();
    } catch {
        throw { status: 'error', errorType: 'unknown', message: res.statusText || 'The server returned an invalid response.' };
    }
    if (!res.ok || vm.status !== 'success') throw vm;
    return vm;
};

/** Sends a JSON body to an account mutation route under /api/feature. */
export const sendMutation = <T extends { status: string } = AccountMutationViewModel>(
    path: string,
    method: 'POST' | 'PUT' | 'DELETE',
    body: unknown,
) =>
    fetchViewModel<T>(`/api/feature/${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
