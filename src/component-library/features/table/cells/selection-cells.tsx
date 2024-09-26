import { HiCheck, HiMinus, HiPlus } from 'react-icons/hi';
import React from 'react';

const containerStyles = 'flex flex-row items-center space-x-2';
const iconSize = 'h-5 w-5';

export const SelectableCell = (props: { onSelect: () => void; selected: boolean; value: string }) => {
    return (
        <div className={containerStyles} onClick={props.onSelect}>
            {props.selected ? <HiCheck className={`text-base-success-600 ${iconSize}`} /> : <HiPlus className={`text-brand-500 ${iconSize}`} />}
            <span>{props.value}</span>
        </div>
    );
};

export const RemovableCell = (props: { onClick: () => void; value: string }) => {
    return (
        <div className={containerStyles} onClick={props.onClick}>
            <HiMinus className={`text-base-error-500 ${iconSize}`} />
            <span>{props.value}</span>
        </div>
    );
};
