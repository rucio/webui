import { twMerge } from 'tailwind-merge';
import { Collapsible } from '../helpers/Collapsible/Collapsible';
import React, { forwardRef } from 'react';

type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
    label?: string;
    icon?: any;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    theme?: 'blue' | 'orange';
    fullwidth?: boolean;
    onClick?: (args: unknown) => void;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
    const { className, label, icon, type, disabled, theme, fullwidth, onClick, ...otherprops } = props;

    const handleOnClick = props.disabled ? undefined : props.onClick;
    var classes: string[] = ['font-bold rounded py-1 px-3 cursor-pointer'];
    if (!!props.label) {
        return (
            <button
                type={type}
                disabled={props.disabled}
                className={twMerge(
                    'py-1 px-3 h-8 rounded',
                    type === 'submit' ? 'bg-base-success-500 hover:bg-base-success-600 text-text-0' : '',
                    type === 'reset' ? 'bg-base-error-500 hover:bg-base-error-600 text-text-0' : '',
                    type === 'button' || type === undefined ? 'bg-brand-500 hover:bg-brand-600 text-text-0' : '',
                    theme === 'orange' ? 'bg-base-warning-500 hover:bg-base-warning-600 text-text-0' : '',
                    props.disabled ? 'cursor-not-allowed bg-neutral-500 hover:bg-neutral-600 text-text-200' : 'cursor-pointer',
                    fullwidth ?? true ? 'w-full' : '',
                    'font-bold',
                    className ?? '',
                )}
                onClick={handleOnClick}
                id={props.id}
                ref={ref}
                {...otherprops}
            >
                <div className={twMerge('flex justify-center', props.disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
                    <label htmlFor={props.id} className={twMerge(props.disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
                        {props.label}
                    </label>
                    {props.icon ? '\u00A0' : '' /* nonbreaking space */}
                    <div className="flex items-center">{props.icon}</div>
                </div>
            </button>
        );
    } else {
        return (
            <button
                type={type}
                disabled={props.disabled}
                className={twMerge(
                    'py-1 px-3 rounded',
                    type === 'submit' ? 'bg-base-success-500 hover:bg-base-success-600 text-text-0' : '',
                    type === 'reset' ? 'bg-base-error-500 hover:bg-base-error-600 text-text-0' : '',
                    type ?? 'button' === 'button' ? 'bg-brand-500 hover:bg-brand-600 text-text-0' : '',
                    theme === 'orange' ? 'bg-base-warning-500 hover:bg-base-warning-600 text-text-0' : '',
                    props.disabled ? 'cursor-not-allowed bg-neutral-500 hover:bg-neutral-500 text-text-200' : 'cursor-pointer',
                    fullwidth ?? true ? 'w-full' : '',
                    'font-bold',
                    className ?? '',
                )}
                onClick={handleOnClick}
                id={props.id}
                ref={ref}
                {...otherprops}
            >
                <label htmlFor={props.id} className="flex justify-center cursor-pointer">
                    {props.icon}
                </label>
            </button>
        );
    }
});
