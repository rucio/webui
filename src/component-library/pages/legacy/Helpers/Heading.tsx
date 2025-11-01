import React from 'react';
import { twMerge } from 'tailwind-merge';
import { H1 } from '../../../atoms/legacy/text/headings/H1/H1';
import { H2 } from '../../../atoms/legacy/text/headings/H2/H2';

type HeadingProps = React.ComponentPropsWithoutRef<'div'> & {
    title: string;
    subtitle?: string;
    tag?: React.ReactElement;
};

export const Heading: React.FC<HeadingProps> = ({ title, subtitle, tag, ...props }) => {
    const { children, className, ...otherprops } = props;
    return (
        <div
            className={twMerge(
                'rounded-md p-2 border',
                'dark:border-2 dark:border-neutral-0',
                'bg-neutral-0 dark:bg-neutral-800',
                'flex flex-col space-y-2',
                className ?? '',
            )}
            {...otherprops}
        >
            <div className={twMerge('flex flex-col space-y-1')}>
                <H1 className="mt-4">{title}</H1>
                <div className={twMerge('flex flex-row items-baseline space-x-2', !subtitle && !tag ? 'hidden' : '')}>
                    <H2 className="text-neutral-700 mt-1">{subtitle}</H2>
                    {tag}
                </div>
            </div>
            {children}
        </div>
    );
};
