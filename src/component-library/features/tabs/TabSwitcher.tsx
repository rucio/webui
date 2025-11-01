import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/component-library/utils';
import { KeyValueWrapper } from '@/component-library/features/key-value/KeyValueWrapper';

const tabContainerVariants = cva('flex w-full p-1', {
    variants: {
        orientation: {
            horizontal: 'flex-row gap-x-2',
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

const tabItemVariants = cva('cursor-pointer flex items-center justify-center py-1 px-2 transition-colors', {
    variants: {
        active: {
            true: cn(
                'rounded',
                'text-neutral-900 dark:text-neutral-100 whitespace-nowrap',
                'bg-neutral-200 dark:bg-neutral-700',
                'border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
            ),
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
});

export interface TabSwitcherProps extends VariantProps<typeof tabContainerVariants> {
    tabNames: string[];
    onSwitch: (index: number) => void;
    activeIndex: number;
    className?: string;
}

export const TabSwitcher = ({ tabNames, onSwitch, activeIndex, orientation, fullWidth, className }: TabSwitcherProps) => {
    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSwitch(index);
        }
    };

    return (
        <KeyValueWrapper className={cn(tabContainerVariants({ orientation, fullWidth }), className)}>
            {tabNames.map((name, index) => {
                const isActive = index === activeIndex;
                return (
                    <div
                        onClick={() => onSwitch(index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        key={name}
                        className={cn(tabItemVariants({ active: isActive, fullWidth }))}
                        role="tab"
                        aria-selected={isActive}
                        tabIndex={isActive ? 0 : -1}
                    >
                        {name}
                    </div>
                );
            })}
        </KeyValueWrapper>
    );
};

export { tabContainerVariants, tabItemVariants };
