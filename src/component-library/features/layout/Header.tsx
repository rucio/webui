'use client';

import { cn } from '@/component-library/utils';
import { useTheme } from 'next-themes';
import { HiChevronDown, HiMenu, HiMoon, HiSun, HiX } from 'react-icons/hi';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Searchbar } from '@/component-library/pages/legacy/Layout/Searchbar';
import Image from 'next/image';

type TMenuItem = {
    title: string;
    path?: string;
};

type TFullMenuItem = TMenuItem & {
    children?: TMenuItem[];
};

const MenuItem = ({ item, pathname, onClick }: { item: TMenuItem; pathname: string | null; onClick?: () => void }) => {
    const classes = `hover:text-brand-500 ${item.path === pathname && 'text-brand-500 font-semibold'}`;
    return (
        <Link href={item.path ?? '/'} className={classes} onClick={onClick}>
            {item.title}
        </Link>
    );
};

const DesktopNavigationBar = ({ menuItems }: { menuItems: TFullMenuItem[] }) => {
    const pathname = usePathname();

    const getItemChildren = (children: TMenuItem[]) => {
        return (
            <div
                className={cn(
                    'absolute left-0 w-max',
                    'opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto',
                    'bg-neutral-100 dark:bg-neutral-800',
                    'rounded-md border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
                )}
            >
                <div className="flex flex-col space-y-2 px-4 py-2">
                    {children.map(child => (
                        <MenuItem key={child.path} item={child} pathname={pathname} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="hidden md:flex items-center space-x-8">
            {menuItems.map(item => {
                const key = item.title.toLowerCase();
                const classes = `hover:text-brand-500 ${item.path === pathname && 'text-brand-500 font-semibold'}`;
                if (item.path) {
                    return <MenuItem key={item.path} item={item} pathname={pathname} />;
                } else {
                    return (
                        <div key={key} className="relative group">
                            <div className={classes}>
                                <span>{item.title}</span>
                                <HiChevronDown className="inline pl-1 h-5 w-5" />
                            </div>
                            {item.children && getItemChildren(item.children)}
                        </div>
                    );
                }
            })}
        </div>
    );
};

const MobileNavigationBar = ({ menuItems }: { menuItems: TFullMenuItem[] }) => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex md:hidden">
            <button
                className="rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 items-center"
                onClick={() => setIsMenuOpen(prevState => !prevState)}
            >
                <HiMenu className="h-5 w-5" />
            </button>
            {isMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
                    <div className="fixed inset-0 bg-white dark:bg-neutral-900 p-6 overflow-y-auto flex flex-col space-y-6">
                        <button onClick={() => setIsMenuOpen(false)} className="self-end p-2 focus:outline-none">
                            <HiX className="h-5 w-5" />
                        </button>

                        <nav className="flex flex-col items-center justify-center space-y-4">
                            {menuItems.map(item => {
                                if (item.path) {
                                    return <MenuItem key={item.path} item={item} pathname={pathname} onClick={() => setIsMenuOpen(false)} />;
                                } else {
                                    return item.children?.map(child => (
                                        <MenuItem key={child.path} item={child} pathname={pathname} onClick={() => setIsMenuOpen(false)} />
                                    ));
                                }
                            })}
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};

const ThemeSwitchButton = () => {
    const { resolvedTheme, setTheme } = useTheme();
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    const buttonRef = useRef<HTMLDivElement>(null);

    const updateTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };

    useEffect(() => {
        if (resolvedTheme && buttonRef.current) {
            buttonRef.current.className = buttonRef.current.className.replace(' hidden', ' flex');
            setIsDarkMode(resolvedTheme === 'dark');
        }
    }, [resolvedTheme]);

    return (
        <div className="rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 items-center hidden" onClick={updateTheme} ref={buttonRef}>
            {isDarkMode ? <HiMoon className="h-6 w-6" /> : <HiSun className="h-6 w-6" />}
        </div>
    );
};

export const Header = () => {
    const menuItems: TFullMenuItem[] = [
        { title: 'Dashboard', path: '/dashboard' },
        { title: 'DIDs', path: '/did/list' },
        { title: 'RSEs', path: '/rse/list' },
        {
            title: 'Rules',
            children: [
                { title: 'List Rules', path: '/rule/list' },
                { title: 'Create a rule', path: '/rule/create' },
            ],
        },
    ];

    return (
        <header
            className={cn(
                'h-14 z-[100]',
                'border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
                'p-2 flex flex-row justify-between items-center',
            )}
        >
            <div className="flex space-x-1">
                <a className="w-12 h-12">
                    <Image src="/logocropped.svg" alt="Rucio Logo" width={43} height={43} />
                </a>
                <a className="w-12 h-12">
                    <Image src="/experiment-logo.png" alt="Experiment Logo" width={53} height={53} />
                </a>
            </div>
            <div className="flex space-x-8">
                <Searchbar />
                <DesktopNavigationBar menuItems={menuItems} />
            </div>
            <div className="flex h-full">
                <ThemeSwitchButton />
                <MobileNavigationBar menuItems={menuItems} />
            </div>
        </header>
    );
};
