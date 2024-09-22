import React from 'react';
import Link from 'next/link';
import { HiExternalLink } from 'react-icons/hi';
import { twMerge } from 'tailwind-merge';

export const ClickableCell = (props: { href: string; children: React.ReactNode }) => {
    return (
        <Link href={props.href}>
            <div>
                {props.children}
                <HiExternalLink className={twMerge('inline', 'pl-2', 'text-2xl', 'text-neutral-900 dark:text-neutral-100')} />
            </div>
        </Link>
    );
};
