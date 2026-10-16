import { getProtocolColumnDefs } from '@/component-library/pages/RSE/details/DetailsRSEProtocolsTable';
import { RSEDetailsProtocol } from '@/lib/core/entity/rucio';
import { ColDef, ColGroupDef } from 'ag-grid-community';

type ProtocolColDef = ColDef<RSEDetailsProtocol>;
type ProtocolColumn = ProtocolColDef | ColGroupDef<RSEDetailsProtocol>;

const isGroup = (def: ProtocolColumn): def is ColGroupDef<RSEDetailsProtocol> => 'children' in def;

const leafColumns = (defs: ProtocolColumn[]): ProtocolColDef[] => defs.flatMap(def => (isGroup(def) ? leafColumns(def.children) : [def]));

const prefixColumn = (): ProtocolColDef => {
    const column = leafColumns(getProtocolColumnDefs()).find(def => def.field === 'prefix');
    if (!column) throw new Error('prefix column is missing from the protocols table');
    return column;
};

describe('DetailsRSEProtocolsTable column sizing', () => {
    it('grows the prefix column instead of truncating deep storage paths', () => {
        const prefix = prefixColumn();
        // A fixed width pins the column regardless of viewport, which is what truncated prefixes.
        expect(prefix.width).toBeUndefined();
        expect(prefix.flex).toBeGreaterThan(0);
        expect(prefix.minWidth).toBeGreaterThanOrEqual(300);
    });

    it('wraps the prefix so long paths stay fully visible without widening the table', () => {
        const prefix = prefixColumn();
        // Widening far enough for the longest paths would force horizontal scrolling instead.
        expect(prefix.wrapText).toBe(true);
        expect(prefix.autoHeight).toBe(true);
    });
});
