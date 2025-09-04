import React, { useState, useEffect } from 'react';
export const AreaInput: React.FC<
    JSX.IntrinsicElements['textarea'] & {
        content: string;
        onEnterkey?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    }
> = ({ ...props }) => {
    const [content, setContent] = useState<string>(props.content ?? '');
    useEffect(() => {
        setContent(props.content ?? '');
    }, [props.content]);
    return (
        <textarea
            id={props.id}
            value={props.content}
            rows={props.rows}
            placeholder={props.placeholder}
            className="block w-full font-mono border text-text-1000 dark:border-neutral-0 rounded-md focus:border-neutral-300 focus:ring focus:ring-neutral-200 focus:ring-opacity-50 p-2 dark:bg-neutral-800 dark:text-text-0 dark:border-2"
            onBlur={props.onBlur}
            onChange={props.onChange}
            onKeyDown={e => {
                if (e.key === 'Enter') {
                    props.onEnterkey?.(e);
                }
            }}
        />
    );
};
