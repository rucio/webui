import { TIPS } from '@/lib/infrastructure/tips/tips-data';

const tipById = (id: string) => TIPS.find(tip => tip.id === id);

describe('DID search tips', () => {
    it('explains what the All search type does', () => {
        const tip = tipById('did-search-types');
        expect(tip).toBeDefined();
        expect(tip!.content).toMatch(/All/);
        expect(tip!.content).toMatch(/container/i);
        expect(tip!.pages).toContain('/dids');
    });

    it('uses no em dashes in any DID tip, per the project copy rule', () => {
        const didTips = TIPS.filter(tip => tip.pages?.includes('/dids'));
        expect(didTips.length).toBeGreaterThan(0);
        didTips.forEach(tip => {
            expect(tip.content).not.toContain('—');
            expect(tip.title).not.toContain('—');
        });
    });
});
