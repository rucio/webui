import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Heading } from './Heading';
import { Body } from './Body';
import { H3 } from '@/component-library/atoms/legacy/text/headings/H3/H3';

export const Loading: React.FC<React.ComponentPropsWithoutRef<'div'> & { title: string; subtitle?: string }> = ({ title, subtitle, ...props }) => {
    const { children, className, ...otherprops } = props;
    return (
        <div className={twMerge('flex flex-col space-y-2 w-full', className ?? '')} {...otherprops}>
            <Heading title={title} subtitle={subtitle} />
            <Body>
                <H3>Loading...</H3>
            </Body>
        </div>
    );
};
