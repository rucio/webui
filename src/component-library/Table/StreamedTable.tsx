import React, { useEffect } from 'react';
import { RegularTable, RegularTableProps } from '@/component-library/Table/RegularTable';
import { StreamingErrorType, StreamingStatus, UseChunkedStream } from '@/lib/infrastructure/hooks/useChunkedStream';
import { NoLoadedRowsOverlay } from '@/component-library/Table/Overlays/NoLoadedRowsOverlay';
import { useToast } from '@/lib/infrastructure/hooks/useToast';

export interface StreamedTableProps extends RegularTableProps {
    streamingHook: UseChunkedStream<any>;
}

export const StreamedTable = (props: StreamedTableProps) => {
    const { toast } = useToast();
    const { error, status } = props.streamingHook;

    const showErrorToast = () => {
        if (!error) return;
        if (error.type === StreamingErrorType.BAD_METHOD_CALL) return;
        if (error.type === StreamingErrorType.NOT_FOUND) {
            toast({
                title: 'Oops!',
                description: error.message,
                variant: 'info',
            });
        } else {
            toast({
                title: 'Fatal error',
                description: error.message,
                variant: 'error',
            });
        }
    };

    // Ensure the overlay updates when streaming faces an error
    useEffect(() => {
        const gridApi = props.tableRef.current?.api;
        if (status === StreamingStatus.RUNNING || error || gridApi?.getDisplayedRowCount() === 0) {
            gridApi?.showNoRowsOverlay();
        }
        showErrorToast();
    }, [error, status]);

    const { noRowsOverlayComponent, ...otherProps } = props;

    const getDefaultNoRowsElement = (gridProps: any) => {
        return <NoLoadedRowsOverlay error={error} status={status} {...gridProps} />;
    };

    return <RegularTable noRowsOverlayComponent={noRowsOverlayComponent ?? getDefaultNoRowsElement} {...otherProps} />;
};
