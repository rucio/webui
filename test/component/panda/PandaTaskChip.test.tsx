import { render, screen } from '@testing-library/react';
import { PandaTaskChip } from '@/component-library/features/panda/PandaTaskChip';

describe('PandaTaskChip', () => {
    it('renders the task id as plain text without a URL', () => {
        render(<PandaTaskChip taskId="34870879" isLoading />);
        expect(screen.getByText('34870879')).toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('links to BigPanDA in a new tab once the URL is known', () => {
        render(<PandaTaskChip taskId="34870879" url="https://bigpanda.cern.ch/task/?jeditaskid=34870879" />);
        const link = screen.getByRole('link', { name: /PanDA task 34870879/ });
        expect(link).toHaveAttribute('href', 'https://bigpanda.cern.ch/task/?jeditaskid=34870879');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        expect(link).toHaveTextContent('34870879');
    });
});
