import { ComDOMError } from '@/lib/infrastructure/hooks/useComDOM';
import { useEffect, useMemo, useState } from 'react';

export type ErrorListProps = {
    errors: ComDOMError[];
    resolve: (id: number) => void;
    resolveAllErrors: () => void;
};

export type ErrorProps = {
    error: ComDOMError;
    resolve: (id: number) => void;
};
export const Error = ({ error, resolve }: ErrorProps) => {
    const backgroundColor = 'bg-red-50';
    return (
        <li key={error.id} className={`flex p-4 mb-4 text-sm text-red-800 rounded-lg ${backgroundColor}`} role="alert">
            {error.id}
            {error.message}
            {error.cause}
            <button
                className="ml-4 text-red-500 hover:text-red-700"
                onClick={() => {
                    resolve(error.id);
                }}
            >
                resolve
            </button>
        </li>
    );
};
export default function ErrorList({ errors, resolve, resolveAllErrors }: ErrorListProps) {
    return (
        // wrap in a box
        <div className="border-b border-gray-700">
            <h3 className="text-xl text-zinc-500 text-color-red text-center">Errors</h3>
            <br></br>
            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <button
                    className="ml-4 text-red-500 hover:text-red-700"
                    onClick={() => {
                        resolveAllErrors();
                    }}
                >
                    Resolve All Errors
                </button>
            </div>
            {errors.length > 0 ? (
                <div className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                    <svg
                        aria-hidden="true"
                        className="flex-shrink-0 inline w-5 h-5 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                    <span className="sr-only">Danger</span>
                    <div>
                        <span className="font-medium">The following errors occurred:</span>
                        <ul className="mt-1.5 ml-4 list-disc list-inside">
                            {errors.map(error => {
                                return <Error key={error.id} error={error} resolve={resolve} />;
                            })}
                        </ul>
                    </div>
                </div>
            ) : (
                <div>No errors to show</div>
            )}
        </div>
    );
}
