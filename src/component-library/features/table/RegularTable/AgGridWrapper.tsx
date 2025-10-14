'use client';

import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import { forwardRef } from 'react';

export const AgGridWrapper = forwardRef<AgGridReact, AgGridReactProps>((props, ref) => {
    return <AgGridReact {...props} ref={ref} />;
});

AgGridWrapper.displayName = 'AgGridWrapper';
