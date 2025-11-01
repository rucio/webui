import { QueryStatus } from '@tanstack/react-query';
import { useMemo } from 'react';

export type QueryInfoProps = {
    title: string;
    status: QueryStatus | 'not_started' | 'unknown' | 'paused' | 'fetching' | 'idle' | 'preparing_batch' | 'stopped';
    realStatus: string;
};
export default function QueryInfo({ title, status, realStatus }: QueryInfoProps) {
    const backgroundColor = useMemo(() => {
        switch (status) {
            case 'not_started':
                return 'bg-gray-800';
            case 'stopped':
                return 'bg-gray-800';
            case 'idle':
                return 'bg-gray-800';
            case 'pending':
                return 'bg-blue-800';
            case 'preparing_batch':
                return 'bg-yellow-600';
            case 'fetching':
                return 'bg-blue-800';
            case 'error':
                return 'bg-red-800';
            case 'success':
                return 'bg-green-800';
            case 'paused':
                return 'bg-yellow-800';
            default:
                return 'bg-gray-800';
        }
    }, [status]);

    return (
        <div>
            <div
                className={`block max-w-sm p-6 ${backgroundColor} border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700`}
            >
                <div>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">status: {realStatus}</p>
                </div>
            </div>
        </div>
    );
}
