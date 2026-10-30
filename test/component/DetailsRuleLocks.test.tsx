import { act, render, waitFor } from '@testing-library/react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import '@/lib/ag-grid-setup';
import { DetailsRuleLocks } from '@/component-library/pages/Rule/details/DetailsRuleLocks';
import { LockState } from '@/lib/core/entity/rucio';

jest.mock('next-themes', () => ({ useTheme: () => ({ resolvedTheme: 'light', setTheme: jest.fn() }) }));

let gridApi: GridApi | null = null;

jest.mock('@/lib/infrastructure/hooks/useTableStreaming', () => ({
    __esModule: true,
    default: () => ({
        streamingHook: { status: 'stopped' },
        onGridReady: (event: GridReadyEvent) => {
            gridApi = event.api;
        },
        // A null gridApi keeps the component's streaming effect from fetching
        gridApi: null,
    }),
}));

describe('DetailsRuleLocks state column', () => {
    it('sorts the most urgent lock states first by default', async () => {
        render(<DetailsRuleLocks id="rule-id" featureDDMDashboard={false} />);
        // RegularTable only renders the grid after a setTimeout(0) sets isContainerReady
        await waitFor(() => expect(gridApi).not.toBeNull(), { timeout: 4000 });

        act(() => {
            // Neither the expected order nor its reverse, so this fails on a wrong direction and on no sort at all
            gridApi!.setGridOption(
                'rowData',
                [LockState.OK, LockState.UNKNOWN, LockState.STUCK, LockState.REPLICATING].map(state => ({ state })),
            );
        });

        const rendered: LockState[] = [];
        gridApi!.forEachNodeAfterFilterAndSort(node => rendered.push(node.data.state));

        expect(rendered).toEqual([LockState.STUCK, LockState.REPLICATING, LockState.OK, LockState.UNKNOWN]);
    });
});
