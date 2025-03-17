import { twMerge } from 'tailwind-merge';
import { UseComDOM } from '@/lib/infrastructure/hooks/useComDOM';
import React, { JSX, useEffect, useState } from 'react';
import { FetchStatus } from '@tanstack/react-query';
import { HiPause, HiPlay, HiRefresh } from 'react-icons/hi';

const StateButton: React.FC<JSX.IntrinsicElements['button'] & { icon: JSX.Element; state: FetchStatus }> = ({ icon, state, ...props }) => {
    const { className, onClick, ...otherprops } = props;
    const onClickHandler = async (e: any) => {
        e.preventDefault();
        await onClick?.(e);
    };
    return (
        <button
            className={twMerge(
                state === 'fetching'
                    ? 'bg-base-warning-200 text-base-warning-800 hover:bg-base-warning-400'
                    : state === 'idle'
                    ? 'bg-base-info-200 text-base-info-800 hover:bg-base-info-400'
                    : state === 'paused'
                    ? 'bg-neutral-200 text-text-800 hover:bg-neutral-400'
                    : '',
                'h-6 w-6',
                'rounded',
                className ?? '',
            )}
            onClick={onClickHandler}
            {...otherprops}
        >
            {icon}
        </button>
    );
};

export const TableFetchstatus: React.FC<
    JSX.IntrinsicElements['form'] & {
        comdom: UseComDOM<any>;
    }
> = ({ comdom, ...props }) => {
    const { className, ...otherprops } = props;
    const [state, setState] = useState<FetchStatus>('idle');
    useEffect(() => {
        setState(comdom.query.fetchStatus);
    }, [comdom.query.fetchStatus]);

    const prettyStates: Record<FetchStatus, string> = {
        idle: 'Idle',
        fetching: 'Fetching',
        paused: 'Paused',
    };

    return (
        <form
            className={twMerge(
                state === 'fetching'
                    ? 'bg-base-warning-200 text-base-warning-800'
                    : state === 'idle'
                    ? 'bg-base-info-200 text-base-info-800'
                    : state === 'paused'
                    ? 'bg-neutral-200 text-text-800'
                    : '',
                'p-1 rounded-md h-8',
                'flex flex-row justify-center space-x-2 md:space-x-0 md:justify-between',
                className ?? '',
            )}
            {...otherprops}
        >
            <span className="font-semibold">{prettyStates[state]}</span>
            <div className={twMerge('h-6', state !== 'idle' ? 'hidden' : 'inline-block')}>
                <StateButton
                    icon={<HiRefresh className="w-full h-full" />}
                    state={state}
                    onClick={async e => {
                        e.preventDefault();
                        await comdom.start();
                    }} // Request object is already stored in ComDOM
                />
            </div>
            <div className={twMerge('h-6', state === 'idle' ? 'hidden' : 'inline-block')}>
                <StateButton
                    icon={<HiPause className="w-full h-full" />}
                    state={state}
                    onClick={async e => {
                        e.preventDefault();
                        await comdom.pause();
                    }}
                />
                <StateButton
                    icon={<HiPlay className="w-full h-full" />}
                    state={state}
                    onClick={async e => {
                        e.preventDefault();
                        await comdom.resume();
                    }}
                />
            </div>
        </form>
    );
};
