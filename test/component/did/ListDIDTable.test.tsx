import { buildListDIDColumnDefs } from '@/component-library/pages/DID/list/ListDIDTable';
import { DIDTypeBadge } from '@/component-library/features/badges/DID/DIDTypeBadge';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';

const headers = (showTypeColumn: boolean) => buildListDIDColumnDefs(showTypeColumn).map(column => column.headerName);

describe('ListDIDTable column definitions', () => {
    it('adds a Type column when the search was not pinned to a type', () => {
        expect(headers(true)).toEqual(['Identifier', 'Type']);
    });

    it('omits the Type column when the search was pinned to one type', () => {
        expect(headers(false)).toEqual(['Identifier']);
    });

    it('reads the type column from each row did_type', () => {
        const typeColumn = buildListDIDColumnDefs(true).find(column => column.headerName === 'Type');
        expect(typeColumn?.field).toEqual('did_type');
    });

    it('renders the type with the shared DID type badge, not a bespoke renderer', () => {
        const typeColumn: any = buildListDIDColumnDefs(true).find(column => column.headerName === 'Type');
        expect(typeColumn.cellRenderer).toBe(DIDTypeBadge);
    });

    it('uses the shared badge cell layout so the column matches other badge columns', () => {
        const typeColumn: any = buildListDIDColumnDefs(true).find(column => column.headerName === 'Type');
        expect(typeColumn.cellStyle).toBe(badgeCellWrapperStyle);
        expect(typeColumn.cellRendererParams).toEqual({ className: badgeCellClasses });
    });
});
