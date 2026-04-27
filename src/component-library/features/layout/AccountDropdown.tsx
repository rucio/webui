'use client';

import { twMerge } from 'tailwind-merge';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { HiSwitchHorizontal, HiLogout, HiUserAdd, HiLockClosed } from 'react-icons/hi';
import Link from 'next/link';
import { HiUserCircle } from 'react-icons/hi2';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';
import { cn } from '@/component-library/utils';
import { signOut } from 'next-auth/react';
import { ReauthModal } from '@/component-library/features/auth/ReauthModal';

/**
 * Renders one-click switches for accounts with a live token in session.allUsers[],
 * and re-auth-required switches for accounts that share the active identity but
 * have no token (#628 lazy-mint design — see ReauthModal).
 */
const AccountList = (props: {
    accountList: string[];
    linkedAccountNames?: string[];
    onSwitchAccount?: (account: string) => Promise<void>;
    onLinkedSwitchClick?: (account: string) => void;
}) => {
    const handleSwitchAccount = async (account: string) => {
        try {
            if (props.onSwitchAccount) {
                await props.onSwitchAccount(account);
            }
        } catch (error) {
            console.error('Failed to switch account:', error);
        }
    };

    return (
        <div className="flex flex-col">
            {props.accountList.map(account => {
                return (
                    <button
                        className={cn(
                            'text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer',
                            'dark:text-neutral-300 dark:hover:bg-neutral-600',
                            'flex items-center justify-between py-2 px-1 space-x-4',
                            'text-right',
                        )}
                        key={'profile-' + account}
                        onClick={() => handleSwitchAccount(account)}
                    >
                        <HiSwitchHorizontal className="text-2xl text-neutral-900 dark:text-neutral-100 shrink-0" />
                        <span>
                            <span>Switch to </span>
                            <b className="text-neutral-800 dark:text-neutral-100">{account}</b>
                        </span>
                    </button>
                );
            })}
            {props.linkedAccountNames?.map(account => (
                <button
                    className={cn(
                        'text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer',
                        'dark:text-neutral-300 dark:hover:bg-neutral-600',
                        'flex items-center justify-between py-2 px-1 space-x-4',
                        'text-right',
                    )}
                    key={'linked-' + account}
                    onClick={() => props.onLinkedSwitchClick?.(account)}
                    title="Sign in required"
                >
                    <HiLockClosed className="text-2xl text-neutral-500 dark:text-neutral-400 shrink-0" />
                    <span>
                        <span>Switch to </span>
                        <b className="text-neutral-800 dark:text-neutral-100">{account}</b>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 block">sign in required</span>
                    </span>
                </button>
            ))}
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
    accountsPossible: string[];
    /** Names of identity-mapped accounts that need re-auth to switch into (#628). */
    linkedAccountNames?: string[];
    onSignOut?: () => Promise<void>;
    onSwitchAccount?: (account: string) => Promise<void>;
    onRemoveAccount?: (account: string) => Promise<void>;
    onLinkedSwitchClick?: (account: string) => void;
}) => {
    const hasAccountChoice = props.accountsPossible.length !== 1 || (props.linkedAccountNames?.length ?? 0) > 0;

    const handleSingleSignOut = async () => {
        try {
            // If this is the only account, sign out completely
            if (props.accountsPossible.length === 1) {
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
                    accountList={props.accountsPossible.filter(account => account !== props.accountActive)}
                    linkedAccountNames={props.linkedAccountNames?.filter(account => account !== props.accountActive)}
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
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (!menuRef.current?.contains(event.target as Node) && !buttonRef.current?.contains(event.target as Node)) {
            setIsAccountOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuRef, buttonRef]);

    const handleLinkedSwitchClick = (account: string) => {
        setIsAccountOpen(false);
        setReauthTarget(account);
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
                    accountsPossible={siteHeader.availableAccounts?.map(account => account.rucioAccount) ?? []}
                    linkedAccountNames={siteHeader.linkedAccountNames}
                    menuRef={menuRef}
                    onSignOut={onSignOut}
                    onSwitchAccount={onSwitchAccount}
                    onRemoveAccount={onRemoveAccount}
                    onLinkedSwitchClick={handleLinkedSwitchClick}
                />
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
