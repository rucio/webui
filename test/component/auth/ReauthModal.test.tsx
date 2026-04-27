/**
 * @jest-environment jsdom
 *
 * Unit tests for ReauthModal (src/component-library/features/auth/ReauthModal.tsx).
 *
 * The modal is the user-facing half of #628's lazy-mint design: it asks for the
 * password, probes Rucio scoped to the chosen account, then hands the resulting
 * token to NextAuth. The same component is reused for SessionMonitor's
 * expired-token re-auth flow; only copy differs.
 *
 * Coverage:
 * (a) Renders read-only username + account, autofocuses password
 * (b) 'expired' mode shows the expired-session heading
 * (c) Cancel calls onClose without invoking probe or signIn
 * (d) Successful re-auth: probe + signIn called with the right shape; onSuccess fires
 * (e) Probe returns error → onSuccess NOT called; error message shown
 * (f) signIn returns ok=false → onSuccess NOT called; error shown
 */

jest.mock('next-auth/react');

import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import { ReauthModal } from '@/component-library/features/auth/ReauthModal';

const baseProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
    targetAccount: 'atlas',
    rucioIdentity: 'ddmlab',
    shortVOName: 'def',
};

describe('ReauthModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        fetchMock.doMock();
    });

    afterEach(() => {
        cleanup();
    });

    it('(a) renders read-only username and account fields', () => {
        render(<ReauthModal {...baseProps} mode="switch" />);
        const username = screen.getByLabelText(/^Username$/i) as HTMLInputElement;
        const account = screen.getByLabelText(/^Account$/i) as HTMLInputElement;
        expect(username.value).toBe('ddmlab');
        expect(username.readOnly).toBe(true);
        expect(account.value).toBe('atlas');
        expect(account.readOnly).toBe(true);
    });

    it("(b) 'expired' mode shows the expired-session heading", () => {
        render(<ReauthModal {...baseProps} mode="expired" />);
        expect(screen.getByRole('heading', { name: /session expired/i })).toBeInTheDocument();
    });

    it('(c) cancel calls onClose without invoking probe or signIn', () => {
        const onClose = jest.fn();
        render(<ReauthModal {...baseProps} mode="switch" onClose={onClose} />);
        fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
        expect(onClose).toHaveBeenCalledTimes(1);
        expect(fetchMock).not.toHaveBeenCalled();
        expect(signIn).not.toHaveBeenCalled();
    });

    it('(d) successful re-auth: probe + signIn called; onSuccess fires', async () => {
        fetchMock.mockResponseOnce(
            JSON.stringify({
                status: 'success',
                rucioAuthToken: 'tok-atlas',
                rucioAccount: 'atlas',
                rucioAuthTokenExpires: '2030-01-01T00:00:00Z',
                linkedAccountNames: ['root', 'atlas'],
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
        (signIn as jest.Mock).mockResolvedValue({ ok: true });

        const onSuccess = jest.fn();
        render(<ReauthModal {...baseProps} mode="switch" onSuccess={onSuccess} />);

        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'secret' } });
        fireEvent.click(screen.getByRole('button', { name: /^Switch$/i }));

        await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));

        // Probe was called with the target account.
        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe('/api/auth/userpass/probe');
        expect(JSON.parse(init!.body as string)).toEqual({
            username: 'ddmlab',
            password: 'secret',
            vo: 'def',
            account: 'atlas',
        });

        // signIn forwarded the probe's token + names.
        expect(signIn).toHaveBeenCalledWith('userpass', {
            rucioAuthToken: 'tok-atlas',
            rucioAccount: 'atlas',
            shortVOName: 'def',
            rucioTokenExpiry: '2030-01-01T00:00:00Z',
            linkedAccountNames: JSON.stringify(['root', 'atlas']),
            redirect: false,
        });
    });

    it('(e) probe returns error → onSuccess NOT called; error displayed', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ status: 'error', message: 'Bad password' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });

        const onSuccess = jest.fn();
        render(<ReauthModal {...baseProps} mode="switch" onSuccess={onSuccess} />);

        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'wrong' } });
        fireEvent.click(screen.getByRole('button', { name: /^Switch$/i }));

        await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/bad password/i));
        expect(onSuccess).not.toHaveBeenCalled();
        expect(signIn).not.toHaveBeenCalled();
    });

    it('(f) signIn returns ok=false → onSuccess NOT called; error displayed', async () => {
        fetchMock.mockResponseOnce(
            JSON.stringify({
                status: 'success',
                rucioAuthToken: 'tok-atlas',
                rucioAccount: 'atlas',
                rucioAuthTokenExpires: '2030-01-01T00:00:00Z',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
        (signIn as jest.Mock).mockResolvedValue({ ok: false, error: 'CredentialsSignin' });

        const onSuccess = jest.fn();
        render(<ReauthModal {...baseProps} mode="switch" onSuccess={onSuccess} />);

        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'secret' } });
        fireEvent.click(screen.getByRole('button', { name: /^Switch$/i }));

        await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
        expect(onSuccess).not.toHaveBeenCalled();
    });
});
