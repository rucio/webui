import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Heading } from './Heading';
import { Body } from './Body';

export const NotFound: React.FC<React.ComponentPropsWithoutRef<'div'>> = ({ ...props }) => {
    return (
        <div className={twMerge('flex items-center justify-center h-screen')} {...props}>
            <div className="flex flex-col space-y-2">
                <Heading title="404" subtitle="Page not found" />
                <Body>{props.children}</Body>
            </div>
        </div>
    );
};
