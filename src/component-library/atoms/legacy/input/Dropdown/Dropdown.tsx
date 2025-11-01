import { twMerge } from 'tailwind-merge';
import { HiChevronDown } from 'react-icons/hi';
import React, { useState, useEffect, useRef } from 'react';

type DropdownProps<T> = React.ComponentPropsWithoutRef<'div'> & {
    keys: T[];
    renderFunc: (key: T | undefined) => React.ReactElement;
    handleChange: (key: T | undefined) => void; // communicate back to parent
    value?: T | undefined; // the current value, set by the parent
    disableUndefined?: boolean; // if the selection may not be left undefined
};

export function Dropdown<T>(props: DropdownProps<T>): React.ReactElement {
    const [isActive, setActive] = useState<boolean>(false);
    const [selection, setSelection] = useState<T | undefined>(props.value ?? undefined);
    const divref = useRef<HTMLDivElement>(null);
    const buttonref = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (!divref.current?.contains(event.target) && !buttonref.current?.contains(event.target)) {
                setActive(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
    }, [divref, buttonref]);

    // remove undefined to the list of keys if it is disabled
    const keys = props.disableUndefined ? props.keys : [undefined as undefined | T].concat(props.keys);

    // update parent of changes
    useEffect(() => {
        props.handleChange(selection);
    }, [selection, props]);

    return (
        <div className="w-full relative">
            <button
                ref={buttonref}
                onClick={e => {
                    e.preventDefault();
                    setActive(!isActive);
                }}
                className={twMerge(
                    'py-1 px-3 rounded w-full',
                    'bg-brand-500 hover:bg-brand-600 text-neutral-0',
                    'cursor-pointer',
                    'font-bold',
                    'flex justify-center space-x-2',
                )}
            >
                {props.renderFunc(selection)}
                <span className="text-2xl">
                    <HiChevronDown />
                </span>
            </button>
            <div
                ref={divref}
                className={twMerge(
                    isActive ? 'flex' : 'hidden',
                    'absolute right-0 mt-1 w-full rounded border dark:border-2 z-[100]',
                    'p-1 flex-col bg-neutral-0 dark:bg-neutral-700',
                )}
            >
                {keys.map((key, index) => {
                    const handleKeyDown = (e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActive(!isActive);
                            setSelection(key);
                        }
                    };

                    return (
                        <div
                            key={index}
                            className={twMerge(
                                'p-1 rounded select-none cursor-pointer',
                                'bg-neutral-0 odd:bg-neutral-100', // bg normal
                                'dark:bg-neutral-700 dark:odd:bg-neutral-800',
                                'dark:text-neutral-0', // bg dark
                                'hover:bg-neutral-200 dark:hover:bg-neutral-900', // hover (dark and light)
                            )}
                            onClick={e => {
                                setActive(!isActive);
                                setSelection(key);
                            }}
                            onKeyDown={handleKeyDown}
                            role="option"
                            aria-selected={selection === key}
                            tabIndex={0}
                        >
                            {props.renderFunc(key)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
