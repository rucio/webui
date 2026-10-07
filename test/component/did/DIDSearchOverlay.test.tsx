import { render, screen } from '@testing-library/react';
import { DIDSearchOverlay } from '@/component-library/features/search/DIDSearchOverlay';
import { DIDType } from '@/lib/core/entity/rucio';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { StreamingErrorType, StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import { ListDIDsNoticeCode, ListDIDsProgressState } from '@/lib/core/usecase-models/list-dids-usecase-models';

const progressRecord = (types: DIDType[], state: ListDIDsProgressState) =>
    ({ status: 'success', kind: 'progress', progress: { types, state } } as ListDIDsViewModel);

const noticeRecord = (code: ListDIDsNoticeCode) => ({ status: 'success', kind: 'notice', notice: { code, message: '' } } as ListDIDsViewModel);

describe('DIDSearchOverlay', () => {
    it('names the types being searched while the search is running', () => {
        render(<DIDSearchOverlay records={[progressRecord([DIDType.CONTAINER, DIDType.DATASET], 'searching')]} status={StreamingStatus.RUNNING} />);
        expect(screen.getByText(/Searching containers and datasets/i)).toBeInTheDocument();
    });

    it('shows only the current step, not a growing list', () => {
        render(
            <DIDSearchOverlay
                records={[
                    progressRecord([DIDType.CONTAINER, DIDType.DATASET], 'searching'),
                    progressRecord([DIDType.CONTAINER, DIDType.DATASET], 'empty'),
                    progressRecord([DIDType.FILE], 'searching'),
                ]}
                status={StreamingStatus.RUNNING}
            />,
        );
        expect(screen.getByText(/Searching files/i)).toBeInTheDocument();
        expect(screen.queryByText(/Searching containers and datasets/i)).not.toBeInTheDocument();
    });

    it('explains an empty result by naming what was tried', () => {
        render(
            <DIDSearchOverlay
                records={[progressRecord([DIDType.CONTAINER, DIDType.DATASET], 'empty'), noticeRecord('no-results')]}
                status={StreamingStatus.STOPPED}
            />,
        );
        expect(screen.getByText(/No DIDs matched this query/i)).toBeInTheDocument();
    });

    it('shows the refine advice when a wildcard stopped the search short', () => {
        render(<DIDSearchOverlay records={[noticeRecord('refine-wildcard')]} status={StreamingStatus.STOPPED} />);
        expect(screen.getByText(/Wildcard searches on files are not supported/i)).toBeInTheDocument();
    });

    it('lets a terminal notice win over a still-running status', () => {
        render(<DIDSearchOverlay records={[noticeRecord('no-results')]} status={StreamingStatus.RUNNING} />);
        expect(screen.getByText(/No DIDs matched this query/i)).toBeInTheDocument();
    });

    it('defers to the standard streaming overlay when a request failed', () => {
        render(
            <DIDSearchOverlay
                records={[]}
                status={StreamingStatus.STOPPED}
                error={{ type: StreamingErrorType.NOT_FOUND, message: 'No entries found.' }}
            />,
        );
        expect(screen.getByText(/No results found/i)).toBeInTheDocument();
    });

    it('defers to the standard overlay before any search has run', () => {
        const { container } = render(<DIDSearchOverlay records={[]} status={StreamingStatus.STOPPED} />);
        expect(container).not.toBeEmptyDOMElement();
        expect(screen.queryByText(/Searching/i)).not.toBeInTheDocument();
    });
});
