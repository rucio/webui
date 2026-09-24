import { render, screen } from '@testing-library/react';
import { DIDSearchProgress } from '@/component-library/features/search/DIDSearchProgress';
import { DIDType } from '@/lib/core/entity/rucio';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';

const progressRecord = (types: DIDType[], state: 'searching' | 'found' | 'empty') =>
    ({ status: 'success', kind: 'progress', progress: { types, state } } as ListDIDsViewModel);

const noticeRecord = (code: 'refine-wildcard' | 'no-results') =>
    ({ status: 'success', kind: 'notice', notice: { code, message: '' } } as ListDIDsViewModel);

describe('DIDSearchProgress', () => {
    it('renders nothing when there are no records', () => {
        const { container } = render(<DIDSearchProgress records={[]} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('names the types currently being searched', () => {
        render(<DIDSearchProgress records={[progressRecord([DIDType.CONTAINER, DIDType.DATASET], 'searching')]} />);
        expect(screen.getByText(/Searching containers and datasets/i)).toBeInTheDocument();
    });

    it('keeps earlier steps visible so a file-only result set is explained', () => {
        render(
            <DIDSearchProgress
                records={[
                    progressRecord([DIDType.CONTAINER, DIDType.DATASET], 'searching'),
                    progressRecord([DIDType.CONTAINER, DIDType.DATASET], 'empty'),
                    progressRecord([DIDType.FILE], 'searching'),
                    progressRecord([DIDType.FILE], 'found'),
                ]}
            />,
        );

        expect(screen.getByText(/No containers and datasets matched/i)).toBeInTheDocument();
        expect(screen.getByText(/Found files/i)).toBeInTheDocument();
    });

    it('announces the refine-wildcard notice with its own copy', () => {
        render(<DIDSearchProgress records={[progressRecord([DIDType.CONTAINER, DIDType.DATASET], 'empty'), noticeRecord('refine-wildcard')]} />);
        expect(screen.getByText(/Wildcard searches on files are not supported/i)).toBeInTheDocument();
    });

    it('announces when nothing matched', () => {
        render(<DIDSearchProgress records={[noticeRecord('no-results')]} />);
        expect(screen.getByText(/No DIDs matched/i)).toBeInTheDocument();
    });
});
