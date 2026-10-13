'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/component-library/atoms/form/select';

export interface FieldSelectProps {
    id: string;
    value: string;
    onValueChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    disabled?: boolean;
    'aria-label'?: string;
    'aria-describedby'?: string;
    className?: string;
}

/** Thin wrapper over the Radix Select atom for single-choice dialog fields. */
export const FieldSelect: React.FC<FieldSelectProps> = ({ id, value, onValueChange, options, placeholder, disabled, className, ...rest }) => (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id={id} className={className} aria-label={rest['aria-label']} aria-describedby={rest['aria-describedby']}>
            <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
            {options.map(o => (
                <SelectItem key={o.value} value={o.value}>
                    {o.label}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
);
