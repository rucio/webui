import React from 'react';
import { Role } from '@/lib/core/entity/account';
import { twMerge } from 'tailwind-merge';

export const RoleTag: React.FC<React.ComponentPropsWithoutRef<'span'> & { role: Role }> = ({ role, ...props }) => {
    return (
        <span
            className={twMerge(
                role === Role.ADMIN ? 'bg-extra-rose-200 dark:bg-extra-rose-700' : role === Role.USER ? 'bg-brand-200 dark:bg-brand-700' : '',
                'text-text-1000 dark:text-text-0',
                'w-24 h-6 rounded text-center select-none',
                'flex flex-row justify-center items-center',
            )}
        >
            {role}
        </span>
    );
};
