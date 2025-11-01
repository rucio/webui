import { HiChevronUp, HiChevronDown } from 'react-icons/hi';
import React from 'react';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { cn } from '@/component-library/utils';

interface ToggleHeaderProps {
    text: string;
    isOpen: boolean;
    onClick: () => void;
}

const ToggleHeader: React.FC<ToggleHeaderProps> = ({ text, isOpen, onClick }) => {
    const chevronSize = 'h-7 w-7';

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div
            className={cn(
                'flex w-full justify-between items-center',
                'cursor-pointer select-none',
                'px-3 py-2',
                'rounded-md border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
                'text-neutral-900 dark:text-neutral-100',
            )}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
        >
            <Heading text={text} size="sm" />
            {isOpen ? <HiChevronUp className={chevronSize} /> : <HiChevronDown className={chevronSize} />}
        </div>
    );
};

export default ToggleHeader;
