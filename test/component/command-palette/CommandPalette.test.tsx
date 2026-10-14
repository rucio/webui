import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FeatureProvider } from '@/component-library/features/feature-flags/FeatureProvider';
import { FeatureFlagMap } from '@/lib/core/entity/feature-config';
import { CommandPalette } from '@/component-library/features/command-palette/CommandPalette';

jest.mock('next-auth/react', () => ({ useSession: () => ({ data: { user: { role: 'user' } } }) }));
jest.mock('@/lib/infrastructure/hooks/usePermissions', () => ({
    usePermissions: () => ({ check: () => false, isReady: true }),
}));

const renderPalette = () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={client}>
            <FeatureProvider features={{ accounts: true } as FeatureFlagMap}>
                <CommandPalette open={true} onOpenChange={jest.fn()} />
            </FeatureProvider>
        </QueryClientProvider>,
    );
};

describe('CommandPalette keyboard navigation', () => {
    const original = Element.prototype.scrollIntoView;
    let scrollIntoView: jest.Mock;
    let scrolled: Element[];

    beforeEach(() => {
        scrolled = [];
        scrollIntoView = jest.fn(function (this: Element) {
            scrolled.push(this);
        });
        Element.prototype.scrollIntoView = scrollIntoView;
        global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) })) as any;
    });

    afterEach(() => {
        Element.prototype.scrollIntoView = original;
    });

    it('scrolls the newly selected item into view after ArrowDown', () => {
        renderPalette();
        const input = screen.getByRole('combobox');
        scrollIntoView.mockClear();
        scrolled.length = 0;

        fireEvent.keyDown(input, { key: 'ArrowDown' });

        expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
        const target = scrolled[scrolled.length - 1];
        expect(target.getAttribute('aria-selected')).toBe('true');
        const options = Array.from(document.querySelectorAll('#command-palette-results [aria-selected]'));
        expect(options.indexOf(target)).toBe(1);
    });
});
