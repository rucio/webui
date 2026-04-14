import { StreamingError, StreamingErrorType, StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import { LoadingSpinner } from '@/component-library/atoms/loading/LoadingSpinner';
import React from 'react';
import { NoDataYetOverlay } from '@/component-library/features/table/overlays/NoDataYetOverlay';

export const NoLoadedRowsOverlay = (props: { error?: StreamingError; status: StreamingStatus }) => {
    // TODO: add icons
    if (props.error) {
        if (props.error.type === StreamingErrorType.NOT_FOUND) {
            return <div className="text-neutral-700 dark:text-neutral-100">Nothing found</div>;
        } else if (props.error.type !== StreamingErrorType.BAD_METHOD_CALL) {
            return (
                <div className="text-neutral-700 dark:text-neutral-100">
                    An <b>error</b> has occurred
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
