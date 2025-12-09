import React from 'react';
import { cn } from '@/component-library/utils';
import { Checkbox } from '@/component-library/atoms/form/checkbox';

interface LabeledCheckboxProps {
    checked: boolean;
    onChange: () => void;
    label: string;
    className?: string; // Optional className prop
}

export const LabeledCheckbox: React.FC<LabeledCheckboxProps> = ({ checked, onChange, label, className }) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onChange();
        }
    };

    return (
        <div
            className={cn('flex flex-row items-center space-x-3 w-fit cursor-pointer', className)}
            onClick={onChange}
            onKeyDown={handleKeyDown}
            role="checkbox"
            aria-checked={checked}
            tabIndex={0}
        >
            <Checkbox checked={checked} />
            <span className="select-none text-neutral-900 dark:text-neutral-100">{label}</span>
        </div>
    );
};
