import { twMerge } from 'tailwind-merge';
import React, { useState } from 'react';
import { HiChevronUp, HiChevronDown } from 'react-icons/hi';
import { Collapsible } from '../helpers/Collapsible/Collapsible';

export const Accordion: React.FC<React.ComponentPropsWithoutRef<'div'> & { name: string }> = ({ name, ...props }) => {
    /*
        Accordion: a collapsible section with a header that can be clicked to expand/collapse the section.

        Usage:
        <Accordion name="Accordion Name">
            <p>Accordion content</p>
        </Accordion>

        Notes:
        - The name prop is required.
        - All other props are passed to the Collapsible component. (incl. children, className, etc.)
        */
    const [accordion, setAccordion] = useState<boolean>(false);
    const { className, children, ...otherprops } = props;
    return (
        <div className={twMerge()}>
            <h2>
                <button
                    className={twMerge(
                        'flex items-center justify-between',
                        'w-full py-2',
                        'text-text-600 dark:text-text-100',
                        'border-b-2 border-neutral-300 dark:border-neutral-100',
                    )}
                    onClick={() => {
                        setAccordion(!accordion);
                    }}
                >
                    <h4 className="font-bold">{name}</h4>
                    {accordion ? <HiChevronUp className="text-xl" /> : <HiChevronDown className="text-xl" />}
                </button>
            </h2>
            <Collapsible showIf={accordion} className={twMerge(className ?? '')} {...otherprops}>
                {children}
            </Collapsible>
        </div>
    );
};
