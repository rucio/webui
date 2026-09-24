import { buildListDIDColumnDefs } from '@/component-library/pages/DID/list/ListDIDTable';
import { DIDType } from '@/lib/core/entity/rucio';

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

    it('renders a row type through the DID type tag', () => {
        const typeColumn: any = buildListDIDColumnDefs(true).find(column => column.headerName === 'Type');
        const rendered = typeColumn.cellRenderer({ value: DIDType.CONTAINER });
        expect(rendered.props.didtype).toEqual(DIDType.CONTAINER);
    });

    it('falls back to Unknown when a row carries no type', () => {
        const typeColumn: any = buildListDIDColumnDefs(true).find(column => column.headerName === 'Type');
        const rendered = typeColumn.cellRenderer({ value: undefined });
        expect(rendered.props.didtype).toEqual(DIDType.UNKNOWN);
    });
});
