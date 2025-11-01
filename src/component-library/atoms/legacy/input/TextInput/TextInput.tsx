import React from 'react';
import { twMerge } from 'tailwind-merge';

type TextInputProps = React.ComponentPropsWithoutRef<'input'> & {
    onEnterkey?: (event: any) => void;
};

export const TextInput: React.FC<TextInputProps> = ({ onEnterkey, ...props }) => {
    const { className, children, onKeyDown, ...otherprops } = props;
    return (
        <input
            className={twMerge(
                'w-full h-8 px-2 pt-2 ',
                'dark:border-neutral-400 dark:bg-neutral-800 bg-neutral-0 text-neutral-1000 dark:text-neutral-0 ',
                'border rounded-sm',
                'dark:border-2 dark:border-neutral-0',
                props.className ?? '',
            )}
            onKeyDown={e => {
                if (e.key === 'Enter') {
                    onEnterkey?.(e);
                }
                onKeyDown?.(e);
            }}
            {...otherprops}
        >
            {children}
        </input>
    );
};
