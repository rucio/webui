'use client';

import { cn } from '@/component-library/utils';
import { useTheme } from 'next-themes';
import { HiMoon, HiSun } from 'react-icons/all';
import { useEffect, useRef, useState } from 'react';

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
    return (
        <header
            className={cn(
                'h-14 z-[100]',
                'border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
                'p-2 flex flex-row',
            )}
        >
            <ThemeSwitchButton />
        </header>
    );
};
