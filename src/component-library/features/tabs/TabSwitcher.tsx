'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/component-library/utils';
import { KeyValueWrapper } from '@/component-library/features/key-value/KeyValueWrapper';

const tabContainerVariants = cva('relative flex w-full', {
    variants: {
        orientation: {
            horizontal: 'flex-row border-b border-neutral-200 dark:border-neutral-700',
            vertical: 'flex-col gap-y-2',
        },
        fullWidth: {
            true: '',
            false: 'w-fit',
        },
    },
    defaultVariants: {
        orientation: 'horizontal',
        fullWidth: true,
    },
});

const tabItemVariants = cva(
    'relative cursor-pointer flex items-center justify-center px-4 py-3 text-sm font-medium transition-all duration-150 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-0 dark:focus-visible:ring-offset-neutral-900 motion-reduce:transition-none',
    {
        variants: {
            active: {
                true: 'text-brand-600 dark:text-brand-400',
                false: 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100',
            },
            fullWidth: {
                true: 'flex-1',
                false: '',
            },
        },
        defaultVariants: {
            active: false,
            fullWidth: true,
        },
    },
);

export interface TabSwitcherProps extends VariantProps<typeof tabContainerVariants> {
    tabNames: string[];
    onSwitch: (index: number) => void;
    activeIndex: number;
    className?: string;
}

export const TabSwitcher = ({ tabNames, onSwitch, activeIndex, orientation = 'horizontal', fullWidth = true, className }: TabSwitcherProps) => {
    const [mounted, setMounted] = React.useState(false);
    const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({ left: 0, width: 0, opacity: 0 });
    const tabRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSwitch(index);
        }
    };

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if (!mounted) return;

        const activeTab = tabRefs.current[activeIndex];
        if (activeTab && orientation === 'horizontal') {
            setIndicatorStyle({
                left: activeTab.offsetLeft,
                width: activeTab.offsetWidth,
                opacity: 1,
            });
        }
    }, [activeIndex, orientation, tabNames, mounted]);

    return (
        <KeyValueWrapper className={cn(tabContainerVariants({ orientation, fullWidth }), className)}>
            {tabNames.map((name, index) => {
                const isActive = index === activeIndex;
                return (
                    <div
                        ref={el => {
                            tabRefs.current[index] = el;
                        }}
                        onClick={() => onSwitch(index)}
                        onKeyDown={e => handleKeyDown(e, index)}
                        key={name}
                        className={cn(tabItemVariants({ active: isActive, fullWidth }))}
                        role="tab"
                        aria-selected={isActive}
                        tabIndex={0}
                    >
                        {name}
                    </div>
                );
            })}
            {orientation === 'horizontal' && (
                <div
                    className="absolute bottom-0 h-0.5 bg-brand-600 dark:bg-brand-400 transition-all duration-200 ease-in-out motion-reduce:transition-none"
                    style={indicatorStyle}
                />
            )}
        </KeyValueWrapper>
    );
};

export { tabContainerVariants, tabItemVariants };
