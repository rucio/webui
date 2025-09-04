import { useState, useEffect } from 'react';

export const NumInput: React.FC<Omit<JSX.IntrinsicElements['input'], 'value'> & { value: number; onEnterkey?: (event: any) => void }> = ({
    value,
    ...props
}) => {
    const [numvalue, setNumvalue] = useState<number>(value);
    useEffect(() => {
        setNumvalue(value);
    }, [value]);
    const onEnterkey = (event: any) => {
        setNumvalue(event.target.value);
        if (event.key === 'Enter') {
            props.onEnterkey?.(event); // might need to pass actual value in here too, to bypass he rerender
        }
    };
    return (
        <input
            type="number"
            value={numvalue > 0 ? numvalue : ''}
            className="w-full border dark:border-neutral-400 rounded-sm px-2 pt-2 text-text-1000 dark:text-text-0 bg-neutral-0 dark:bg-neutral-800 dark:border-2"
            onKeyDown={onEnterkey}
            {...props}
        >
            {props.children}
        </input>
    );
};
