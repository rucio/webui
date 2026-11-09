/**
 * @jest-environment jsdom
 *
 * Every producer of ?callbackUrl= encodes the path exactly once and
 * useSearchParams().get() already reverses that, so decoding a second time
 * destroys escapes that belong to the path itself.  See #794.
 */

jest.mock('next/navigation');

import { render, act, cleanup } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import type { AuthViewModel } from '@/lib/infrastructure/data/auth/auth';

let mockLoginProps: any;

jest.mock('@/component-library/pages/Login/Login', () => ({
    Login: (props: any) => {
        mockLoginProps = props;
        return null;
    },
}));

import Login from '@/app/auth/login/page';

const push = jest.fn();

/** Renders the login page with the given (already once-decoded) callbackUrl and
 *  returns the URL a successful userpass sign-in redirects to. */
async function redirectTargetFor(callbackUrl: string): Promise<string> {
    (useRouter as jest.Mock).mockReturnValue({ push });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(`callbackUrl=${encodeURIComponent(callbackUrl)}`));
    (signIn as jest.Mock).mockResolvedValue({ ok: true });
    fetchMock.mockResponseOnce(JSON.stringify({ status: 'success' }));

    await act(async () => {
        render(<Login />);
    });
    await act(async () => {
        await mockLoginProps.userPassSessionHandler({ status: 'success' } as unknown as AuthViewModel, 'root', 'def');
    });
    return push.mock.calls[0][0];
}

describe('login page callbackUrl round trip', () => {
    beforeEach(() => {
        push.mockClear();
        fetchMock.resetMocks();
    });
    afterEach(cleanup);

    it('keeps an encoded slash inside a DID name escaped', async () => {
        expect(await redirectTargetFor('/did/ddmadmin/foo%2Fbar')).toBe('/did/ddmadmin/foo%2Fbar');
    });

    it('keeps a literal percent in a DID name escaped', async () => {
        expect(await redirectTargetFor('/did/ddmadmin/a%25b')).toBe('/did/ddmadmin/a%25b');
    });
});
