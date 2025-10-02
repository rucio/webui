import React from 'react';
import { twMerge } from 'tailwind-merge';
import { DIDAvailability } from '@/lib/core/entity/rucio';

export const AvailabilityTag: React.FC<React.ComponentPropsWithoutRef<'span'> & { availability: DIDAvailability }> = ({
    availability = 'Available',
    ...props
}) => {
    return (
        <span
            className={twMerge(
                availability === DIDAvailability.AVAILABLE
                    ? 'bg-base-success-200 dark:bg-base-success-700'
                    : availability === DIDAvailability.DELETED
                    ? 'bg-neutral-200 dark:bg-neutral-700'
                    : 'bg-brand-200 dark:bg-brand-700', // Lost
                'text-text-1000 dark:text-text-0 italic',
                'w-24 h-6 rounded text-center select-none',
                'flex flex-row justify-center items-center',
            )}
        >
            {availability}
        </span>
    );
};
