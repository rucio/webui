'use client';

import { twMerge } from 'tailwind-merge';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { HiSwitchHorizontal, HiLogout, HiUserAdd, HiLockClosed } from 'react-icons/hi';
import Link from 'next/link';
import { HiUserCircle } from 'react-icons/hi2';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';
import { cn } from '@/component-library/utils';
import { signOut, useSession } from 'next-auth/react';
import { AuthType } from '@/lib/core/entity/auth-models';
import { ReauthModal } from '@/component-library/features/auth/ReauthModal';
import { switchX509Account } from '@/lib/infrastructure/auth/x509-switch';

/**
 * One entry in the dropdown's switchable-accounts list.
 *
 * Live entries (account already has a token in session.allUsers[]) carry
 * `kind: 'live'` and switch via `update({ account })`.
 *
 * Linked entries (account is mapped to the active identity but has no live
 * token, see #628) carry `kind: 'linked'`. For userpass these need a password
 * re-prompt; for x509 the cert is re-presented silently. The same account
 * name can legitimately appear in both lists scoped to different auth
 * methods, so keys are derived from `kind:authType:account`.
 */
type SwitchableAccount = {
    account: string;
    authType: AuthType | null;
    kind: 'live' | 'linked';
};

/**
 * Builds the ordered list of switchable accounts for the dropdown:
 *   1. live (already-authenticated) entries from session.allUsers, excluding the active one
 *   2. linked entries (#628) — accounts mapped to the active identity but with no live token
 *
 * Linked entries inherit the *active* user's auth type because they describe
 * accounts on that same identity that haven't been signed into yet. Including
 * the auth type here lets the dropdown disambiguate same-named accounts that
 * appear on more than one auth path and gives each row a stable React key.
 */
const buildSwitchEntries = (siteHeader: SiteHeaderViewModel, activeAuthType: AuthType | null): SwitchableAccount[] => {
    const activeName = siteHeader.activeAccount?.rucioAccount ?? '';
    const live: SwitchableAccount[] = (siteHeader.availableAccounts ?? [])
        .filter(u => u.rucioAccount !== activeName)
        .map(u => ({ account: u.rucioAccount, authType: u.rucioAuthType ?? null, kind: 'live' as const }));
    const linked: SwitchableAccount[] = (siteHeader.linkedAccountNames ?? [])
        .filter(name => name !== activeName)
        .map(name => ({ account: name, authType: activeAuthType, kind: 'linked' as const }));
    return [...live, ...linked];
};

/**
 * Human-readable label for a Rucio auth method. Shown next to each switch
 * entry so the user knows which auth path will be used — important when the
 * same account name maps via more than one method. Returns null when the
 * auth type is unknown, so the row can omit the "via …" subtitle entirely
 * instead of rendering a confusing placeholder.
 */
const authTypeLabel = (t: AuthType | null | undefined): string | null => {
    switch (t) {
        case AuthType.USERPASS:
            return 'userpass';
        case AuthType.x509:
            return 'x509';
        case AuthType.OIDC:
            return 'OIDC';
        default:
            return null;
    }
};

/**
 * Renders one-click switches for accounts with a live token, and lazy-switch
 * entries for accounts mapped to the active identity but without a token
 * yet (#628). Userpass linked entries open a password re-auth modal; x509
 * linked entries trigger a silent cert-bearing re-fetch.
 */
const AccountList = (props: {
    entries: SwitchableAccount[];
    /** Whether linked entries require explicit re-auth (userpass) or are silent (x509). */
    linkedSwitchRequiresReauth?: boolean;
    onSwitchAccount?: (account: string) => Promise<void>;
    onLinkedSwitchClick?: (account: string) => void;
}) => {
    const handleLiveSwitch = async (account: string) => {
        try {
            if (props.onSwitchAccount) {
                await props.onSwitchAccount(account);
            }
        } catch (error) {
            console.error('Failed to switch account:', error);
        }
    };

    const reauth = props.linkedSwitchRequiresReauth ?? false;

    return (
        <div className="flex flex-col">
            {props.entries.map(entry => {
                const isLinked = entry.kind === 'linked';
                const showLock = isLinked && reauth;
                const Icon = showLock ? HiLockClosed : HiSwitchHorizontal;
                const subLabel = isLinked && reauth ? 'sign in required' : null;
                return (
                    <button
                        className={cn(
                            'text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer',
                            'dark:text-neutral-300 dark:hover:bg-neutral-600',
                            'flex items-center justify-between py-2 px-1 space-x-4',
                            'text-right',
                        )}
                        key={`${entry.kind}:${entry.authType ?? 'unknown'}:${entry.account}`}
                        onClick={() => (isLinked ? props.onLinkedSwitchClick?.(entry.account) : handleLiveSwitch(entry.account))}
                        title={showLock ? 'Sign in required' : isLinked ? 'Switch using your x509 certificate' : undefined}
                    >
                        <Icon
                            className={cn(
                                'text-2xl shrink-0',
                                showLock ? 'text-neutral-500 dark:text-neutral-400' : 'text-neutral-900 dark:text-neutral-100',
                            )}
                        />
                        <span>
                            <span>Switch to </span>
                            <b className="text-neutral-800 dark:text-neutral-100">{entry.account}</b>
                            {(() => {
                                const label = authTypeLabel(entry.authType);
                                const parts = [label ? `via ${label}` : null, subLabel].filter(Boolean);
                                return parts.length > 0 ? (
                                    <span className="text-xs text-neutral-500 dark:text-neutral-400 block">{parts.join(' · ')}</span>
                                ) : null;
                            })()}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

const SignOutOfAllButton = ({ onSignOut }: { onSignOut?: () => Promise<void> }) => {
    const handleSignOut = async () => {
        try {
            if (onSignOut) {
                await onSignOut();
            } else {
                // Fallback: use NextAuth's signOut directly.
                // NOTE: This path bypasses SessionMonitorProvider's isManualSignOutRef guard,
                // so the unauthenticated-redirect watcher will append ?expired=true to the
                // login URL. This is intentional here — this branch is only reached in
                // Storybook (where SessionMonitorProvider is absent). In the real app the
                // onSignOut prop is always supplied by HeaderClient via useSessionMonitor().
                await signOut({ callbackUrl: '/auth/login' });
            }
        } catch (error) {
            console.error('Failed to sign out:', error);
        }
    };

    return (
        <button
            className={cn(
                'text-neutral-800 hover:bg-base-error-500 hover:bg-opacity-40 hover:cursor-pointer',
                'dark:text-neutral-100',
                'flex items-center justify-between py-2 px-1 space-x-4 w-full',
                'text-right',
            )}
            onClick={handleSignOut}
            type="button"
        >
            <span>
                Sign <b>out</b> of all accounts
            </span>
            <HiLogout className="dark:text-neutral-100 text-2xl text-neutral-900 shrink-0" />
        </button>
    );
};

const SignIntoButton = () => {
    return (
        <Link
            className={cn(
                'text-neutral-800 hover:bg-base-success-500 hover:bg-opacity-40 hover:cursor-pointer',
                'dark:text-neutral-100',
                'flex items-center justify-between py-2 px-1 space-x-4',
                'text-right',
            )}
            href="/auth/login"
            prefetch={false}
        >
            <span>
                Sign <b>in to</b> another account
            </span>
            <HiUserAdd className="dark:text-neutral-100 text-2xl text-neutral-900 shrink-0" />
        </Link>
    );
};

export const AccountDropdown = (props: {
    menuRef: RefObject<HTMLDivElement | null>;
    accountActive: string;
    /** Switchable accounts excluding the active one. Live + linked, ordered by AccountButton. */
    switchEntries: SwitchableAccount[];
    /** Total live accounts in session (including active). Drives single-account sign-out shortcut. */
    liveAccountCount: number;
    /** True when a linked switch needs an explicit credential re-prompt (userpass). */
    linkedSwitchRequiresReauth?: boolean;
    onSignOut?: () => Promise<void>;
    onSwitchAccount?: (account: string) => Promise<void>;
    onRemoveAccount?: (account: string) => Promise<void>;
    onLinkedSwitchClick?: (account: string) => void;
}) => {
    const hasAccountChoice = props.switchEntries.length > 0;

    const handleSingleSignOut = async () => {
        try {
            // If this is the only account, sign out completely
            if (props.liveAccountCount === 1) {
                if (props.onSignOut) {
                    await props.onSignOut();
                } else {
                    // Fallback: use NextAuth's signOut directly.
                    // NOTE: This path bypasses SessionMonitorProvider's isManualSignOutRef guard,
                    // so the unauthenticated-redirect watcher will append ?expired=true to the
                    // login URL. This is intentional here — this branch is only reached in
                    // Storybook (where SessionMonitorProvider is absent). In the real app the
                    // onSignOut prop is always supplied by HeaderClient via useSessionMonitor().
                    await signOut({ callbackUrl: '/auth/login' });
                }
                return;
            }

            // Remove the current account from the session
            if (props.onRemoveAccount) {
                await props.onRemoveAccount(props.accountActive);
            }
        } catch (error) {
            console.error('Failed to sign out:', error);
        }
    };

    return (
        <div
            className={cn(
                'divide-y divide-neutral-300 dark:divide-neutral-700',
                'w-64 sm:w-fit p-2',
                'absolute top-[52px] right-2',
                'rounded-md border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
                'bg-neutral-100 dark:bg-neutral-800',
                'z-[100]',
            )}
            onMouseEnter={e => e.preventDefault()}
            ref={props.menuRef}
        >
            <div
                className={twMerge(
                    'text-neutral-600 hover:cursor-pointer',
                    'dark:text-neutral-300',
                    'flex justify-between items-center py-4 px-1 space-x-4',
                    'text-right',
                )}
            >
                <span className="text-xl">
                    <span>Hello, </span>
                    <b className="text-neutral-900 dark:text-neutral-100">{props.accountActive}</b>!
                </span>
                <button
                    className={cn(
                        'bg-neutral-200 dark:bg-neutral-700 hover:bg-base-error-500 hover:bg-opacity-40 dark:hover:bg-base-error-500 dark:hover:bg-opacity-40',
                        'p-1 rounded-md',
                    )}
                    onClick={handleSingleSignOut}
                    title="Sign out of this account"
                >
                    <HiLogout className="text-2xl text-neutral-900 dark:text-neutral-100 shrink-0" />
                </button>
            </div>
            {hasAccountChoice && (
                <AccountList
                    entries={props.switchEntries}
                    linkedSwitchRequiresReauth={props.linkedSwitchRequiresReauth}
                    onSwitchAccount={props.onSwitchAccount}
                    onLinkedSwitchClick={props.onLinkedSwitchClick}
                />
            )}
            <SignIntoButton />
            {hasAccountChoice && <SignOutOfAllButton onSignOut={props.onSignOut} />}
        </div>
    );
};

export const AccountButton = ({
    siteHeader,
    onSignOut,
    onSwitchAccount,
    onRemoveAccount,
}: {
    siteHeader: SiteHeaderViewModel;
    onSignOut?: () => Promise<void>;
    onSwitchAccount?: (account: string) => Promise<void>;
    onRemoveAccount?: (account: string) => Promise<void>;
}) => {
    const [isAccountOpen, setIsAccountOpen] = React.useState(false);
    const [reauthTarget, setReauthTarget] = useState<string | null>(null);
    const [switchError, setSwitchError] = useState<string | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // The active session is the source of truth for auth type — siteHeader.activeAccount
    // is a slim public User shape and intentionally omits credential-flavoured fields.
    const { data: session, update: updateSession } = useSession();
    const activeAuthType = session?.user?.rucioAuthType ?? null;
    const linkedSwitchRequiresReauth = activeAuthType === AuthType.USERPASS;

    const handleClickOutside = (event: MouseEvent) => {
        if (!menuRef.current?.contains(event.target as Node) && !buttonRef.current?.contains(event.target as Node)) {
            setIsAccountOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuRef, buttonRef]);

    const handleLinkedSwitchClick = async (account: string) => {
        setIsAccountOpen(false);
        if (activeAuthType === AuthType.USERPASS) {
            // Userpass: open the password re-auth modal.
            setReauthTarget(account);
            return;
        }
        if (activeAuthType === AuthType.x509) {
            // x509: silent re-fetch via the browser cert. No modal, no password.
            const rucioAuthHost = siteHeader.rucioAuthHost ?? '';
            const shortVOName = siteHeader.activeAccount?.rucioVO ?? '';
            const result = await switchX509Account({ rucioAuthHost, targetAccount: account, shortVOName });
            if (result.ok) {
                window.location.reload();
            } else {
                setSwitchError(result.error);
            }
            return;
        }
        if (activeAuthType === AuthType.OIDC) {
            // OIDC: server-side repoint via NextAuth update(). The OIDC token is
            // identity-scoped (Rucio validates the identity, not per-account),
            // so the JWT callback can build a new SessionUser for the target
            // account using the existing token i.e. no identity provider round-trip.
            try {
                await updateSession({ switchOidcAccount: account });
                window.location.reload();
            } catch (error) {
                setSwitchError(`Could not switch to ${account}: ${(error as Error).message}`);
            }
            return;
        }
        setSwitchError(`Switching is not supported for this authentication method`);
    };

    return (
        <>
            <button
                className="rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 flex items-center"
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                ref={buttonRef}
            >
                <HiUserCircle className="text-2xl" />
            </button>
            {isAccountOpen && (
                <AccountDropdown
                    accountActive={siteHeader.activeAccount?.rucioAccount ?? ''}
                    switchEntries={buildSwitchEntries(siteHeader, activeAuthType)}
                    liveAccountCount={siteHeader.availableAccounts?.length ?? 0}
                    linkedSwitchRequiresReauth={linkedSwitchRequiresReauth}
                    menuRef={menuRef}
                    onSignOut={onSignOut}
                    onSwitchAccount={onSwitchAccount}
                    onRemoveAccount={onRemoveAccount}
                    onLinkedSwitchClick={handleLinkedSwitchClick}
                />
            )}
            {switchError && (
                <div
                    role="alert"
                    className="fixed top-16 right-2 z-50 max-w-sm rounded-md border border-base-error-500 bg-base-error-50 dark:bg-base-error-900 p-3 text-sm text-base-error-700 dark:text-base-error-200"
                >
                    <button
                        className="float-right ml-2 text-base-error-700 dark:text-base-error-200 hover:underline"
                        onClick={() => setSwitchError(null)}
                    >
                        ×
                    </button>
                    {switchError}
                </div>
            )}
            {reauthTarget && siteHeader.activeAccount && (
                <ReauthModal
                    isOpen={true}
                    mode="switch"
                    targetAccount={reauthTarget}
                    rucioIdentity={siteHeader.activeAccount.rucioIdentity}
                    shortVOName={siteHeader.activeAccount.rucioVO}
                    onClose={() => setReauthTarget(null)}
                    onSuccess={() => {
                        // Full reload so the entire React tree, query cache, and RSC tree
                        // are rebuilt against the new active account's Rucio token —
                        // mirrors the existing handleSwitchAccount path in HeaderClient.
                        window.location.reload();
                    }}
                />
            )}
        </>
    );
};
