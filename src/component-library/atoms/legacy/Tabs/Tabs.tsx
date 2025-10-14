import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export const Tabs: React.FC<
    React.ComponentPropsWithoutRef<'div'> & {
        tabs: string[];
        _ariaControls?: string[];
        active: number;
        updateActive: (active: number) => void;
    }
> = ({ tabs, active, updateActive, ...props }) => {
    const { className, ...otherprops } = props;

    /*
        ARIA for tabs:
          - `Tab` places focus on *active* tab. Tabbing again will move focus
          into the tabpanel. It is *not* possible to cycle through the tabs with
          the tab key.
          - `left arrow` and `right arrow` keys move focus between tabs.
          - we use buttons with role="tab" in a div with role="tablist" to implement this.
        Refer to https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role#example
        */
    const [activestate, setActivestate] = useState<number>(active); // handle state internally
    useEffect(() => {
        setActivestate(active);
    }, [active]); // update internal state when external factors (props) change
    useEffect(() => {
        document.getElementById(`tab-${activestate.toString()}`)?.focus();
    }, [activestate]); // focus on tab when internal state changes
    const changeFunc = (id: number) => {
        let newId = id;
        if (id < 0) {
            newId = tabs.length - 1;
        }
        if (id >= tabs.length) {
            newId = 0;
        }
        setActivestate(newId);
        updateActive(newId);
    }; // update internal state and external state when tab is clicked
    const changeFuncEvent = (event: any) => {
        changeFunc(Number(event.target.dataset.id));
    }; // wrap for event handler
    return (
        <div
            className={twMerge(
                'flex flex-col sm:flex-row',
                'list-none font-bold',
                'bg-neutral-0 dark:bg-neutral-900',
                'border-0 dark:border-2 dark:rounded-md dark:bg-clip-content',
                className ?? '',
            )}
            role="tablist"
            aria-label="Select Virtual Organisation"
        >
            {tabs.map((element, index) => {
                return index === Number(activestate) ? (
                    <button
                        onClick={changeFuncEvent}
                        data-id={index.toString()}
                        className={twMerge(
                            'flex-1 p-4 hover:cursor-pointer',
                            'border-b-4 border-brand-500',
                            'text-brand-500 hover:bg-neutral-100 dark:hover:bg-transparent',
                            'dark:rounded-b-sm',
                        )}
                        key={index.toString()} // required by react
                        role="tab"
                        aria-selected="true"
                        tabIndex={0}
                        aria-controls={props._ariaControls ? props._ariaControls[index] : ''}
                        id={`tab-${index.toString()}`} // indexed as tab-0, tab-1, etc. Refer to this in the tabpanels.
                        onKeyDown={event => {
                            if (event.key === 'ArrowLeft') {
                                changeFunc(index - 1);
                            }
                            if (event.key === 'ArrowRight') {
                                changeFunc(index + 1);
                            }
                        }}
                    >
                        <span className="pointer-events-none">{element}</span>
                    </button>
                ) : (
                    <button
                        onClick={changeFuncEvent}
                        data-id={index.toString()}
                        className={twMerge(
                            'flex-1 p-4 hover:cursor-pointer',
                            'border-b-4 border-neutral-300 dark:border-neutral-100',
                            'text-text-600 dark:text-text-100 hover:bg-neutral-100 dark:hover:bg-transparent',
                        )}
                        key={index.toString()}
                        role="tab"
                        aria-selected="false"
                        tabIndex={-1}
                        aria-controls={props._ariaControls ? props._ariaControls[index] : ''}
                        onKeyDown={event => {
                            if (event.key === 'ArrowLeft') {
                                changeFunc(index - 1);
                            }
                            if (event.key === 'ArrowRight') {
                                changeFunc(index + 1);
                            }
                        }}
                    >
                        <span className="pointer-events-none">{element}</span>
                    </button>
                );
            })}
        </div>
    );
};
