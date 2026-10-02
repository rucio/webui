import { buildDIDSearchUrl } from '@/lib/infrastructure/utils/navigation';
import { getActionCommands } from '@/lib/infrastructure/command-palette/command-registry';
import { DIDType } from '@/lib/core/entity/rucio';

describe('DID search navigation', () => {
    it('passes the type through when one is given', () => {
        const url = buildDIDSearchUrl({ pattern: 'test:data1', type: DIDType.DATASET });
        expect(url).toContain(`type=${DIDType.DATASET}`);
    });

    it('sends command palette DID searches to All', () => {
        const actions = getActionCommands('test:data1');
        const search = actions.find(action => action.id === 'action-search-dids');
        expect(search).toBeDefined();
        expect(search!.url).toContain(`type=${DIDType.ALL}`);
        expect(search!.url).toContain('autoSearch=true');
    });

    it('does not force a type when the search has no pattern', () => {
        expect(buildDIDSearchUrl({})).toEqual('/dids');
    });
});
