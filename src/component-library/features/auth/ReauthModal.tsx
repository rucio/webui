'use client';

import { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { signIn } from 'next-auth/react';
import { Button } from '@/component-library/atoms/form/button';
import { Input } from '@/component-library/atoms/form/input';
import { cn } from '@/component-library/utils';
import { AUTH_ERROR_MESSAGES } from '@/lib/core/entity/auth-errors';

/**
 * Why this exists
 * ---------------
 * #628 wants users to be able to switch between accounts that share a Rucio
 * identity even when one was auto-selected as the default. We do *not* mint
 * tokens for the linked accounts at login time (that would put N bearer tokens
 * in the cookie for N accounts the user never explicitly chose). Instead, the
 * dropdown surfaces "switch to X; sign in required" entries, and clicking one
 * opens this modal: it asks for the password, hits /api/auth/userpass/probe
 * scoped to the target account, and calls signIn() with the resulting token.
 *
 * The same component is used when an active userpass session expires; the
 * SessionMonitor opens it in 'expired' mode so the user can re-auth in place
 * without losing their current page.
 */

export type ReauthMode = 'switch' | 'expired';

interface ReauthModalProps {
    /** Controls modal visibility. */
    isOpen: boolean;
    /** Called when the user dismisses the modal without authenticating. */
    onClose: () => void;
    /** Called after a successful re-auth + signIn. Parent typically reloads the page. */
    onSuccess: () => void;

    /** Why the modal is open; drives copy. */
    mode: ReauthMode;
    /** The account the user is re-authenticating into. */
    targetAccount: string;
    /** The Rucio identity (= username for userpass); username field is read-only. */
    rucioIdentity: string;
    /** VO short name to scope the auth call. */
    shortVOName: string;
}

export const ReauthModal = ({ isOpen, onClose, onSuccess, mode, targetAccount, rucioIdentity, shortVOName }: ReauthModalProps) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    // Reset transient state every time the modal closes/opens so the next reuse starts clean.
    useEffect(() => {
        if (!isOpen) {
            setPassword('');
            setError(undefined);
            setIsSubmitting(false);
            return;
        }
        // Autofocus the password field; the username/account fields are read-only.
        const t = setTimeout(() => passwordInputRef.current?.focus(), 0);
        return () => clearTimeout(t);
    }, [isOpen]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!password || isSubmitting) return;

        setIsSubmitting(true);
        setError(undefined);

        try {
            // 1. Probe Rucio for a token scoped to the target account.
            const res = await fetch('/api/auth/userpass/probe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: rucioIdentity,
                    password,
                    vo: shortVOName,
                    account: targetAccount,
                }),
            });

            let body: {
                status?: 'success' | 'multiple_accounts' | 'error';
                message?: string;
                rucioAuthToken?: string;
                rucioAccount?: string;
                rucioAuthTokenExpires?: string;
                linkedAccountNames?: string[];
            } = {};
            try {
                body = await res.json();
            } catch {
                setError(`Unexpected response from auth server (${res.status})`);
                return;
            }

            if (body.status !== 'success' || !body.rucioAuthToken || !body.rucioAccount || !body.rucioAuthTokenExpires) {
                setError(body.message || (res.status === 401 ? AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS : 'Authentication failed'));
                return;
            }

            // 2. Hand the token to NextAuth; same path as the login page's success branch.
            const result = await signIn('userpass', {
                rucioAuthToken: body.rucioAuthToken,
                rucioAccount: body.rucioAccount,
                shortVOName,
                rucioTokenExpiry: body.rucioAuthTokenExpires,
                linkedAccountNames: body.linkedAccountNames ? JSON.stringify(body.linkedAccountNames) : undefined,
                redirect: false,
            });

            if (result?.ok) {
                onSuccess();
            } else {
                setError(result?.error || AUTH_ERROR_MESSAGES.UNKNOWN_ERROR);
            }
        } catch (err) {
            console.error('[ReauthModal] Re-auth failed:', err);
            setError(AUTH_ERROR_MESSAGES.UNKNOWN_ERROR);
        } finally {
            setIsSubmitting(false);
        }
    };

    const title = mode === 'expired' ? 'Session expired' : `Switch to ${targetAccount}`;
    const description =
        mode === 'expired'
            ? `Your session for ${targetAccount} has expired. Re-enter your password to continue.`
            : `Re-enter your password to start a session as ${targetAccount}.`;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => {
                if (!isSubmitting) onClose();
            }}
            ariaHideApp={false}
            overlayClassName="fixed inset-0 z-40 flex items-center justify-center bg-neutral-900/50 dark:bg-neutral-900/70 backdrop-blur-sm"
            className={cn(
                'mx-2 max-w-md w-full rounded-lg shadow-lg z-50',
                'border border-neutral-200 dark:border-neutral-700',
                'bg-neutral-0 dark:bg-neutral-800',
                'flex flex-col p-6',
                'outline-none focus:outline-none',
            )}
            contentLabel={title}
        >
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{title}</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 pt-2 pb-4">{description}</p>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                <div className="space-y-1">
                    <label htmlFor="reauth-username" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        Username
                    </label>
                    <Input id="reauth-username" type="text" value={rucioIdentity} readOnly className="w-full bg-neutral-100 dark:bg-neutral-700" />
                </div>
                <div className="space-y-1">
                    <label htmlFor="reauth-account" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        Account
                    </label>
                    <Input id="reauth-account" type="text" value={targetAccount} readOnly className="w-full bg-neutral-100 dark:bg-neutral-700" />
                </div>
                <div className="space-y-1">
                    <label htmlFor="reauth-password" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        Password
                    </label>
                    <Input
                        ref={passwordInputRef}
                        id="reauth-password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="current-password"
                        className="w-full"
                        disabled={isSubmitting}
                    />
                </div>

                {error && (
                    <p role="alert" className="text-sm text-base-error-600 dark:text-base-error-400">
                        {error}
                    </p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="neutral" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !password}>
                        {isSubmitting ? 'Signing in…' : mode === 'expired' ? 'Continue' : 'Switch'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
