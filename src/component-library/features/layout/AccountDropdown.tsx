'use client';

import { twMerge } from 'tailwind-merge';
import React, { RefObject, useEffect, useRef } from 'react';
import { HiSwitchHorizontal, HiLogout, HiUserAdd, HiChevronDown } from 'react-icons/hi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiUserCircle } from 'react-icons/hi2';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';
import { cn } from '@/component-library/utils';
import { useSession, signOut } from 'next-auth/react';

const AccountList = (props: { accountList: string[] }) => {
    const { update } = useSession();
    const router = useRouter();

    const handleSwitchAccount = async (account: string) => {
        try {
            // Use NextAuth's session.update() to switch accounts
            await update({ account });
            // Optionally refresh the page to update all components
            router.refresh();
        } catch (error) {
            console.error('Failed to switch account:', error);
        }
    };

    return (
        <div className="flex flex-col">
            {props.accountList.map((account) => {
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
        </div>
    );
};

const SignOutOfAllButton = () => {
    const handleSignOut = async () => {
        try {
            // Use NextAuth's signOut to clear all sessions
            await signOut({ callbackUrl: '/auth/login' });
        } catch (error) {
            console.error('Failed to sign out:', error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSignOut();
        }
    };

    return (
        <div
            className={cn(
                'text-neutral-800 hover:bg-base-error-500 hover:bg-opacity-40 hover:cursor-pointer',
                'dark:text-neutral-100',
                'flex items-center justify-between py-2 px-1 space-x-4',
                'text-right',
            )}
            onClick={handleSignOut}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
        >
            <span>
                Sign <b>out</b> of all accounts
            </span>
            <HiLogout className="dark:text-neutral-100 text-2xl text-neutral-900 shrink-0" />
        </div>
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

export const AccountDropdown = (props: { menuRef: RefObject<HTMLDivElement | null>; accountActive: string; accountsPossible: string[] }) => {
    const hasAccountChoice = props.accountsPossible.length !== 1;
    const { update } = useSession();
    const router = useRouter();

    const handleSingleSignOut = async () => {
        try {
            // If this is the only account, sign out completely
            if (props.accountsPossible.length === 1) {
                await signOut({ callbackUrl: '/auth/login' });
                return;
            }

            // Remove the current account from the session
            await update({ removeAccount: props.accountActive });

            // Refresh the page to update all components with the new active account
            router.refresh();
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
            {hasAccountChoice && <AccountList accountList={props.accountsPossible.filter(account => account !== props.accountActive)} />}
            <SignIntoButton />
            {hasAccountChoice && <SignOutOfAllButton />}
        </div>
    );
};

export const AccountButton = ({ siteHeader }: { siteHeader: SiteHeaderViewModel }) => {
    const [isAccountOpen, setIsAccountOpen] = React.useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: any) => {
        if (!menuRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) {
            setIsAccountOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
    }, [menuRef, buttonRef]);

    return (
        <>
            <button
                className="rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 items-center"
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                ref={buttonRef}
            >
                <HiUserCircle className="text-2xl" />
            </button>
            {isAccountOpen && (
                <AccountDropdown
                    accountActive={siteHeader.activeAccount?.rucioAccount ?? ''}
                    accountsPossible={siteHeader.availableAccounts?.map(account => account.rucioAccount) ?? []}
                    menuRef={menuRef}
                />
            )}
        </>
    );
};
