import { twMerge } from 'tailwind-merge';
import React, {RefObject, useEffect, useRef} from 'react';
import {HiSwitchHorizontal, HiLogout, HiUserAdd, HiChevronDown} from 'react-icons/hi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {HiUserCircle} from "react-icons/hi2";
import {SiteHeaderViewModel} from "@/lib/infrastructure/data/view-model/site-header";

const AccountList = (props: { accountList: string[] }) => {
    return (
        <div className="flex flex-col">
            {props.accountList.map((account, index) => {
                return (
                    <a
                        className={twMerge(
                            'text-text-600 hover:bg-neutral-200 hover:cursor-pointer',
                            'dark:text-text-300 dark:hover:bg-neutral-600',
                            'flex items-center justify-between py-2 px-1 space-x-4',
                            'text-right',
                        )}
                        key={"profile-" + account}
                        href={`/api/auth/switch?account=${account}&&callbackUrl=/dashboard`}
                    >
                        <HiSwitchHorizontal className="text-2xl text-text-900 dark:text-text-100 shrink-0" />
                        <span>
                            <span>Switch to </span>
                            <b className="text-text-800 dark:text-text-100">{account}</b>
                        </span>
                    </a>
                );
            })}
        </div>
    );
};

const SignOutOfAllButton = () => {
    const router = useRouter();

    const signOut = async () => {
        const request = new Request('/api/auth/logout', {
            method: 'POST',
        });
        //TODO: handle errors
        await fetch(request);
        router.push('/auth/login');
    };

    return (
        <div
            className={twMerge(
                'text-text-800 hover:bg-base-error-200 hover:cursor-pointer',
                'dark:text-text-100 dark:hover:bg-base-error-500',
                'flex items-center justify-between py-2 px-1 space-x-4',
                'text-right',
            )}
            onClick={() => signOut()}
        >
            <span>
                Sign <b>out</b> of all accounts
            </span>
            <HiLogout className="dark:text-text-100 text-2xl text-text-900 shrink-0" />
        </div>
    );
};

const SignIntoButton = () => {
    return (
        <Link
            className={twMerge(
                'text-text-800 hover:bg-base-success-200 hover:cursor-pointer',
                'dark:text-text-100 dark:hover:bg-base-success-600',
                'flex items-center justify-between py-2 px-1 space-x-4',
                'text-right',
            )}
            href="/auth/login"
            prefetch={false}
        >
            <span>
                Sign <b>in to</b> another account
            </span>
            <HiUserAdd className="dark:text-text-100 text-2xl text-text-900 shrink-0" />
        </Link>
    );
};

export const AccountDropdown = (
    props: {
        menuRef: RefObject<HTMLDivElement>,
        accountActive: string;
        accountsPossible: string[];
    },
) => {
    const hasAccountChoice = props.accountsPossible.length !== 1;

    return (
        <div
            className={twMerge(
                'divide-y divide-neutral-300 dark:divide-neutral-700',
                'w-64 sm:w-fit p-2',
                'absolute top-11 right-2',
                'rounded-md border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
                'bg-neutral-100 dark:bg-neutral-800',
                'z-[100]',
            )}
            onMouseEnter={e => e.preventDefault()}
            ref={props.menuRef}
        >
            <div
                className={twMerge(
                    'text-text-600 hover:cursor-pointer',
                    'dark:text-text-300',
                    'flex justify-between items-center py-4 px-1 space-x-4',
                    'text-right',
                )}
            >
                <span className="text-xl">
                    <span>Hello, </span>
                    <b className="text-text-800 dark:text-text-100">{props.accountActive}</b>!
                </span>
                <div className={twMerge('bg-neutral-200 hover:bg-base-error-300 dark:hover:bg-base-error-500', 'p-1', 'rounded-md')}>
                    {/* Using the <a> tag here prevents a bug with response caching */}
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a href="/api/auth/logout?callbackUrl=/dashboard">
                        <HiLogout className="text-2xl text-text-900 shrink-0" />
                    </a>
                </div>
            </div>
            {hasAccountChoice && <AccountList accountList={props.accountsPossible.filter(account => account !== props.accountActive)} />}
            <SignIntoButton />
            {hasAccountChoice && <SignOutOfAllButton />}
        </div>
    );
};

export const AccountButton = ({siteHeader}: {siteHeader: SiteHeaderViewModel}) => {
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


    return <>
        <button
            className="rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 items-center"
            onClick={() => setIsAccountOpen(!isAccountOpen)}
            ref={buttonRef}
        >
            <HiUserCircle className="text-2xl"/>
        </button>
        {isAccountOpen &&
        <AccountDropdown
            accountActive={siteHeader.activeAccount?.rucioAccount ?? ''}
            accountsPossible={siteHeader.availableAccounts?.map(account => account.rucioAccount) ?? []}
            menuRef={menuRef}
        />}
    </>;
};
