import { fireEvent, render, screen } from '@testing-library/react';
import { ICellRendererParams } from 'ag-grid-community';
import {
    buildReplicaPFNQuery,
    DEFAULT_REPLICA_PFN_OPTIONS,
    ReplicaPFNOptions,
    ReplicaPFNOptionsValue,
} from '@/component-library/pages/DID/details/views/ReplicaPFNOptions';
import { PFNCell } from '@/component-library/pages/DID/details/tables/DetailsDIDFileReplicasTable';
import { FileReplicaStateViewModel } from '@/lib/infrastructure/data/view-model/did';

const query = (options: Partial<ReplicaPFNOptionsValue>) =>
    Object.fromEntries(
        [...buildReplicaPFNQuery('test', 'file1', { ...DEFAULT_REPLICA_PFN_OPTIONS, ...options }).entries()].reduce(
            (map, [key, value]) => map.set(key, map.has(key) ? [map.get(key), value].flat() : value),
            new Map<string, string | string[]>(),
        ),
    );

describe('buildReplicaPFNQuery', () => {
    it('sends only the DID and all states by default, like the WebUI did before', () => {
        expect(query({})).toEqual({ scope: 'test', name: 'file1', allStates: 'true' });
    });

    it('maps the CLI options to query parameters', () => {
        expect(query({ protocols: ' root, davs ,', domain: 'lan', rseExpression: ' tier=1 ', includeUnavailable: false })).toEqual({
            scope: 'test',
            name: 'file1',
            schemes: ['root', 'davs'],
            domain: 'lan',
            rseExpression: 'tier=1',
            allStates: 'false',
        });
    });

    it('forces all states for missing only, like --missing', () => {
        expect(query({ rseExpression: 'XRD1', includeUnavailable: false, missingOnly: true }).allStates).toBe('true');
    });
});

describe('ReplicaPFNOptions', () => {
    const renderOptions = (onApply = jest.fn()) => {
        render(
            <ReplicaPFNOptions
                idPrefix="test"
                value={DEFAULT_REPLICA_PFN_OPTIONS}
                onApply={onApply}
                onCopyPFNs={jest.fn()}
                onDownloadMetalink={jest.fn()}
            />,
        );
        return onApply;
    };

    it('applies the options with the Apply button', () => {
        const onApply = renderOptions();
        fireEvent.change(screen.getByLabelText('Protocols'), { target: { value: 'root' } });
        fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
        expect(onApply).toHaveBeenCalledWith({ ...DEFAULT_REPLICA_PFN_OPTIONS, protocols: 'root' });
    });

    it('applies the options with Enter in a text field', () => {
        const onApply = renderOptions();
        const rseExpression = screen.getByLabelText('RSE expression');
        fireEvent.change(rseExpression, { target: { value: 'XRD1' } });
        fireEvent.keyDown(rseExpression, { key: 'Enter' });
        expect(onApply).toHaveBeenCalledWith({ ...DEFAULT_REPLICA_PFN_OPTIONS, rseExpression: 'XRD1' });
    });

    it('enables missing only once an RSE expression is set', () => {
        const onApply = renderOptions();
        const missingOnly = screen.getByRole('checkbox', { name: 'Missing only' });
        expect(missingOnly).toBeDisabled();

        fireEvent.change(screen.getByLabelText('RSE expression'), { target: { value: 'XRD1' } });
        expect(missingOnly).toBeEnabled();
        fireEvent.click(missingOnly);
        fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

        expect(onApply).toHaveBeenCalledWith({ ...DEFAULT_REPLICA_PFN_OPTIONS, rseExpression: 'XRD1', missingOnly: true });
    });
});

describe('PFNCell', () => {
    const renderCell = (value: string | null) =>
        render(<PFNCell {...({ value } as ICellRendererParams<FileReplicaStateViewModel, string | null>)} />);

    it('shows the PFN', () => {
        renderCell('root://xrd1:1094//rucio/test/80/25/file1');
        expect(screen.getByText('root://xrd1:1094//rucio/test/80/25/file1')).toBeInTheDocument();
    });

    it('marks replicas without a PFN', () => {
        renderCell(null);
        expect(screen.getByText('No PFN')).toBeInTheDocument();
    });
});
