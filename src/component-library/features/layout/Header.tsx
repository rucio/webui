import { cn } from '@/component-library/utils';
import { useTheme } from 'next-themes';

export const Header = () => {
    const { setTheme } = useTheme();

    return (
        <header className={cn('h-14 z-[100]', 'border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10')}>
            <button onClick={() => setTheme('dark')}>Dark</button>
            <button onClick={() => setTheme('light')}>Light</button>
        </header>
    );
};
