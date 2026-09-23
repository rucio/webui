import { fireEvent, render, screen } from '@testing-library/react';
import { AMITagChips } from '@/component-library/features/ami/AMITagChips';
import { AMITagInfo } from '@/lib/core/usecase-models/get-ami-tag-info-usecase-models';

// Radix Popper measures its anchor with ResizeObserver, which jsdom lacks.
// Without this stub the popover throws on open (verified 2026-09-23).
class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}
(global as unknown as { ResizeObserver: unknown }).ResizeObserver ??= ResizeObserverStub;

const url = (tag: string) => `https://atlas-ami.cern.ch/?subapp=tagsShow&userdata=${tag}`;

const infos: AMITagInfo[] = [
    {
        tag: 'm2281',
        url: url('m2281'),
        found: true,
        productionStep: 'merge',
        baseRelease: 'Athena_24.0.128',
        transformation: 'AODMerge_tf.py',
        description: 'm2272 with 24.0.128 for first 2026 run',
        created: '2026-02-09 18:04:58',
    },
    { tag: 'f9999', url: url('f9999'), found: false },
    { tag: 'r1234', url: url('r1234'), found: null },
];

describe('AMITagChips', () => {
    it('renders plain, unlinked chips while loading', () => {
        render(<AMITagChips tags={['f1723', 'm2281']} isLoading />);
        expect(screen.getByText('f1723')).toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('renders one external link per tag once infos arrive, in tag order', () => {
        render(<AMITagChips tags={['m2281', 'f9999', 'r1234']} infos={infos} />);
        const links = screen.getAllByRole('link');
        expect(links.map(l => l.getAttribute('href'))).toEqual([url('m2281'), url('f9999'), url('r1234')]);
        links.forEach(link => {
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        });
    });

    it('shows AMI details on hover for a found tag', async () => {
        render(<AMITagChips tags={['m2281']} infos={infos} />);
        fireEvent.mouseEnter(screen.getByRole('link', { name: /m2281/ }));
        expect(await screen.findByText('Athena_24.0.128')).toBeInTheDocument();
        expect(screen.getByText('AODMerge_tf.py')).toBeInTheDocument();
        expect(screen.getByText('m2272 with 24.0.128 for first 2026 run')).toBeInTheDocument();
    });

    it('says "Not found in AMI" on focus for an unknown tag', async () => {
        render(<AMITagChips tags={['f9999']} infos={infos} />);
        fireEvent.focus(screen.getByRole('link', { name: /f9999/ }));
        expect(await screen.findByText('Not found in AMI')).toBeInTheDocument();
    });

    it('says "AMI details unavailable" when the lookup failed', async () => {
        render(<AMITagChips tags={['r1234']} infos={infos} />);
        fireEvent.mouseEnter(screen.getByRole('link', { name: /r1234/ }));
        expect(await screen.findByText('AMI details unavailable')).toBeInTheDocument();
    });

    it('falls back to a plain chip for a tag missing from infos', () => {
        render(<AMITagChips tags={['e8514']} infos={infos} />);
        expect(screen.getByText('e8514')).toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
});
