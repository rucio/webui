import {StreamingError, StreamingErrorType} from "@/lib/infrastructure/hooks/useChunkedStream";
import {LoadingSpinner} from "@/component-library/ui/loading-spinner";
import React from "react";

export const NoLoadedRowsOverlay = (props: { error?: StreamingError }) => {
    // TODO: add icons
    if (props.error) {
        if (props.error.type === StreamingErrorType.NOT_FOUND) {
            return <div className="text-neutral-700 dark:text-neutral-100">Nothing found</div>;
        } else if (props.error.type !== StreamingErrorType.BAD_METHOD_CALL) {
            return <div className="text-neutral-700 dark:text-neutral-100">An <b>error</b> has happened</div>;
        }
    }
    return <LoadingSpinner/>;
}