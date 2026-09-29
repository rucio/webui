import { render, screen } from '@testing-library/react';
import { ListDIDTips } from '@/component-library/pages/DID/list/ListDIDTips';

describe('ListDIDTips', () => {
    it('keeps the existing guidance on purpose, scope, name and metadata filters', () => {
        render(<ListDIDTips />);
        expect(screen.getByText(/Purpose:/)).toBeInTheDocument();
        expect(screen.getByText(/Scope:/)).toBeInTheDocument();
        expect(screen.getByText(/Name:/)).toBeInTheDocument();
        expect(screen.getByText(/Metadata filters:/)).toBeInTheDocument();
    });

    it('explains the DID types the search offers', () => {
        render(<ListDIDTips />);
        const tips = screen.getAllByRole('list')[0];
        expect(tips).toHaveTextContent(/Type:/);
        expect(tips).toHaveTextContent(/Container/);
        expect(tips).toHaveTextContent(/Dataset/);
        expect(tips).toHaveTextContent(/File/);
    });

    it('says what the default All type does', () => {
        render(<ListDIDTips />);
        const tips = screen.getAllByRole('list')[0];
        expect(tips).toHaveTextContent(/All/);
        expect(tips).toHaveTextContent(/containers and datasets/i);
    });

    it('warns that a wildcard excludes files', () => {
        render(<ListDIDTips />);
        expect(screen.getAllByRole('list')[0]).toHaveTextContent(/wildcard/i);
    });

    it('uses no em dashes, per the project copy rule', () => {
        const { container } = render(<ListDIDTips />);
        expect(container.textContent).not.toContain('—');
    });
});
