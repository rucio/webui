import { buildSearchLocations } from '@/component-library/features/layout/Searchbar';
import { DIDType } from '@/lib/core/entity/rucio';

describe('Searchbar location ordering', () => {
    it('offers All first for a DID-shaped query, so Enter runs the cascade', () => {
        const locations = buildSearchLocations('test:container');
        expect(locations[0].getHref('test:container')).toContain(`type=${DIDType.ALL}`);
    });

    it('still offers the pinned DID types after All', () => {
        const hrefs = buildSearchLocations('test:container').map(location => location.getHref('test:container'));
        expect(hrefs.some(href => href.includes('type=dataset'))).toEqual(true);
        expect(hrefs.some(href => href.includes('type=file'))).toEqual(true);
        expect(hrefs.some(href => href.includes('type=container'))).toEqual(true);
    });

    it('uses All for a generic query that could be a DID', () => {
        const locations = buildSearchLocations('somename');
        const didLocation = locations.find(location => location.name === 'DIDs');
        expect(didLocation).toBeDefined();
        expect(didLocation!.getHref('somename')).toContain(`type=${DIDType.ALL}`);
    });

    it('offers nothing DID-shaped for an RSE expression', () => {
        const locations = buildSearchLocations('DISK&TAPE');
        expect(locations.map(location => location.name)).not.toContain('DIDs');
    });
});
