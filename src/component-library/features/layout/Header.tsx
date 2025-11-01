'use client';

import { cn } from '@/component-library/utils';
import { useTheme } from 'next-themes';
import { HiChevronDown, HiMenu, HiMoon, HiSun, HiX } from 'react-icons/hi';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Searchbar } from '@/component-library/features/layout/Searchbar';
import Image from 'next/image';
import { AccountButton, AccountDropdown } from '@/component-library/features/layout/AccountDropdown';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';
import { LoadingSpinner } from '@/component-library/atoms/loading/LoadingSpinner';
import { WarningField } from '@/component-library/features/fields/WarningField';
import { motion } from 'framer-motion';

type TMenuItem = {
    title: string;
    path?: string;
};

type TFullMenuItem = TMenuItem & {
    children?: TMenuItem[];
};

const MenuItem = ({ item, pathname, onClick }: { item: TMenuItem; pathname: string | null; onClick?: () => void }) => {
    const isActive = item.path === pathname;
    const classes = `hover:text-brand-500 transition-colors duration-150 ${isActive && 'text-brand-500 font-semibold'}`;
    return (
        <Link href={item.path ?? '/'} className={cn(classes, 'relative')} onClick={onClick}>
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
                    'hidden group-hover:block',
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

    // Check if any child of a menu item is active (for Rules dropdown)
    const isChildActive = (item: TFullMenuItem) => {
        if (!item.children) return false;
        return item.children.some(child => child.path === pathname);
    };

    return (
        <nav className="hidden nav:flex items-center space-x-8 relative" aria-label="Main navigation">
            {menuItems.map(item => {
                const key = item.title.toLowerCase();
                const isActive = item.path === pathname || isChildActive(item);
                const classes = `hover:text-brand-500 transition-colors duration-150 ${isActive && 'text-brand-500 font-semibold'}`;

                if (item.path) {
                    return (
                        <div key={item.path} className="relative">
                            <MenuItem item={item} pathname={pathname} />
                            {isActive && (
                                <motion.div
                                    layoutId="desktop-nav-underline"
                                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-brand-500"
                                    initial={false}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 380,
                                        damping: 30,
                                    }}
                                />
                            )}
                        </div>
                    );
                } else {
                    return (
                        <div key={key} className="relative group">
                            <div className={cn(classes, 'cursor-pointer')}>
                                <span>{item.title}</span>
                                <HiChevronDown className="inline pl-1 h-5 w-5" aria-hidden="true" />
                            </div>
                            {item.children && getItemChildren(item.children)}
                            {isActive && (
                                <motion.div
                                    layoutId="desktop-nav-underline"
                                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-brand-500"
                                    initial={false}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 380,
                                        damping: 30,
                                    }}
                                />
                            )}
                        </div>
                    );
                }
            })}
        </nav>
    );
};

const MobileNavigationBar = ({ menuItems }: { menuItems: TFullMenuItem[] }) => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex nav:hidden">
            <button
                className="rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 items-center"
                onClick={() => setIsMenuOpen(prevState => !prevState)}
                aria-label="Toggle mobile menu"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
            >
                <HiMenu className="h-5 w-5" />
            </button>
            {isMenuOpen && (
                <div className="fixed inset-0 bg-neutral-1000 bg-opacity-50 z-50" role="dialog" aria-modal="true">
                    <div id="mobile-menu" className="fixed inset-0 bg-neutral-0 dark:bg-neutral-900 p-6 overflow-y-auto flex flex-col space-y-6">
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="self-end p-2 focus:outline-none"
                            aria-label="Close mobile menu"
                        >
                            <HiX className="h-5 w-5" />
                        </button>

                        <div className="md:hidden block">
                            <Searchbar />
                        </div>

                        <nav className="flex flex-col items-center justify-center space-y-4" aria-label="Mobile navigation">
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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            updateTheme();
        }
    };

    return (
        <div
            className="rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 items-center hidden"
            onClick={updateTheme}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label="Toggle theme"
            ref={buttonRef}
        >
            {isDarkMode ? <HiMoon className="h-6 w-6" /> : <HiSun className="h-6 w-6" />}
        </div>
    );
};

interface HeaderProps {
    siteHeader?: SiteHeaderViewModel;
    siteHeaderError: unknown;
    isSiteHeaderFetching: boolean;
}

export const Header = ({ siteHeader, siteHeaderError, isSiteHeaderFetching }: HeaderProps) => {
    const menuItems: TFullMenuItem[] = [
        { title: 'Dashboard', path: '/dashboard' },
        { title: 'DIDs', path: '/did/list' },
        { title: 'RSEs', path: '/rse/list' },
        { title: 'Subscriptions', path: '/subscription/list' },
        {
            title: 'Rules',
            children: [
                { title: 'List Rules', path: '/rule/list' },
                { title: 'Create a rule', path: '/rule/create' },
            ],
        },
    ];

    const { resolvedTheme } = useTheme();
    const logoPath = resolvedTheme === 'dark' ? '/logo_dark.svg' : '/logo_light.svg';
    const logoSize = 36;

    // Gradient overlay for depth effect - subtle fade from top to bottom
    const gradientOverlay =
        resolvedTheme === 'dark'
            ? 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0) 100%)'
            : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)';

    const getContent = () => {
        if (isSiteHeaderFetching) {
            return <LoadingSpinner />;
        } else if (siteHeaderError || !siteHeader) {
            return (
                <WarningField>
                    <span>Error retrieving site header</span>
                </WarningField>
            );
        } else {
            return (
                <>
                    <div className="flex items-center">
                        <a className="w-12 h-full stroke-white fill-white" href="https://rucio.cern.ch/">
                            <Image src={logoPath} alt="Rucio Logo" width={logoSize} height={logoSize} style={{ height: 'auto' }} />
                        </a>
                        <a className="w-12 h-full" href={siteHeader.projectUrl}>
                            <Image src="/experiment-logo.png" alt="Experiment Logo" width={logoSize} height={logoSize} style={{ height: 'auto' }} />
                        </a>
                        <div className="pl-1 md:block hidden">
                            <Searchbar />
                        </div>
                    </div>
                    <div>
                        <DesktopNavigationBar menuItems={menuItems} />
                    </div>
                    <div className="flex h-full">
                        <ThemeSwitchButton />
                        <AccountButton siteHeader={siteHeader} />
                        <MobileNavigationBar menuItems={menuItems} />
                    </div>
                </>
            );
        }
    };

    return (
        <>
            {/* Skip to main content link for accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-brand-600 focus:text-white focus:rounded focus:shadow-lg"
            >
                Skip to main content
            </a>

            <header
                role="banner"
                className={cn(
                    'sticky top-0 h-14 z-10 relative',
                    'bg-neutral-0/95 dark:bg-neutral-900/95 backdrop-blur-lg',
                    'border-b border-neutral-200 dark:border-neutral-800',
                    'p-2 flex flex-row justify-between items-center',
                    'text-neutral-900 dark:text-neutral-100',
                    'shadow-md dark:shadow-xl',
                )}
            >
                {/* Gradient overlay for depth - fades from top to bottom */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: gradientOverlay,
                    }}
                />
                <div className="relative z-10 flex flex-row justify-between items-center w-full">{getContent()}</div>
            </header>
        </>
    );
};
