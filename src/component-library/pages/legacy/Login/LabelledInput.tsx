import React from 'react';
import { twMerge } from 'tailwind-merge';
import { TextInput } from '../../../atoms/legacy/input/TextInput/TextInput';
import { P } from '../../../atoms/legacy/text/content/P/P';

type LabelledInputProps = React.ComponentPropsWithoutRef<'span'> & {
    label: string;
    idinput: string;
    updateFunc: (data: string) => void;
    password?: boolean;
};

export const LabelledInput: React.FC<LabelledInputProps> = ({ label, idinput, updateFunc, password = false, ...props }) => {
    const { className, ...otherprops } = props;
    return (
        <span className={twMerge('flex flex-row space-x-2 items-baseline', className ?? '')} {...otherprops}>
            <label htmlFor={idinput} id={idinput + '-label'} className={twMerge('w-32 text-right flex-none')}>
                <P className="dark:font-bold">{label}</P>
            </label>
            <TextInput id={idinput} type={password ? 'password' : 'text'} onChange={e => updateFunc(e.target.value)} />
        </span>
    );
};
