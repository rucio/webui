import { HiCheck, HiMinus, HiPlus } from 'react-icons/hi';
import React from 'react';

const containerStyles = 'flex flex-row items-center space-x-2';
const iconSize = 'h-5 w-5';

export const SelectableCell = (props: { onSelect: () => void; selected: boolean; value: string }) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            props.onSelect();
        }
    };

    return (
        <div
            className={containerStyles}
            onClick={props.onSelect}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-pressed={props.selected}
        >
            {props.selected ? (
                <HiCheck className={`flex-shrink-0 text-base-success-600 ${iconSize}`} />
            ) : (
                <HiPlus className={`flex-shrink-0 text-brand-500 ${iconSize}`} />
            )}
            <span>{props.value}</span>
        </div>
    );
};

export const RemovableCell = (props: { onClick: () => void; value: string }) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            props.onClick();
        }
    };

    return (
        <div
            className={containerStyles}
            onClick={props.onClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
        >
            <HiMinus className={`flex-shrink-0 text-base-error-500 ${iconSize}`} />
            <span>{props.value}</span>
        </div>
    );
};
