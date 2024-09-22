import React from 'react';
import { cn } from '@/component-library/utils';
import Checkbox from '@/component-library/atoms/form/Checkbox';

interface LabeledCheckboxProps {
    checked: boolean;
    onChange: () => void;
    label: string;
    className?: string; // Optional className prop
}

export const LabeledCheckbox: React.FC<LabeledCheckboxProps> = ({ checked, onChange, label, className }) => {
    return (
        <div className={cn('flex flex-row items-center space-x-3 w-fit cursor-pointer', className)} onClick={onChange}>
            <Checkbox checked={checked} />
            <span className="select-none text-neutral-900 dark:text-neutral-100">{label}</span>
        </div>
    );
};
