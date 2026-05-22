import { StreamingError, StreamingErrorType, StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import { LoadingSpinner } from '@/component-library/atoms/loading/LoadingSpinner';
import React from 'react';
import { NoDataYetOverlay } from '@/component-library/features/table/overlays/NoDataYetOverlay';

export const NoLoadedRowsOverlay = (props: { error?: StreamingError; status: StreamingStatus }) => {
    if (props.error) {
        if (props.error.type === StreamingErrorType.NOT_FOUND) {
            return (
                <p className="text-sm text-neutral-700 dark:text-neutral-100 text-center px-4">
                    No results found. Try adjusting your filters and searching again.
                </p>
            );
        } else if (props.error.type !== StreamingErrorType.BAD_METHOD_CALL) {
            return (
                <div className="flex flex-col items-center gap-1 text-center px-4">
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-100">Something went wrong while loading data.</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Check your network connection and try searching again.</p>
                </div>
            );
        }
    }
    if (props.status == StreamingStatus.RUNNING) {
        return <LoadingSpinner />;
    } else {
        return <NoDataYetOverlay />;
    }
};
