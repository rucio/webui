import { render, screen } from '@testing-library/react';
import { DetailsDIDMeta } from '@/component-library/pages/DID/details/DetailsDIDMeta';
import { ListDIDMeta } from '@/component-library/pages/DID/list/meta/ListDIDMeta';
import { fixtureDIDMetaViewModel } from 'test/fixtures/table-fixtures';

jest.mock('@/component-library/features/ami/AMITagsRow', () => ({
    AMITagsRow: ({ name }: { name: string }) => <div data-testid="ami-tags-row">{name}</div>,
}));

const NAME = 'data26_hi.00523138.physics_HardProbes.merge.AOD.f1723_m2281._lb0490._0003.1';

describe('AMITagsRow wiring', () => {
    it('DetailsDIDMeta passes the DID name to AMITagsRow', () => {
        render(<DetailsDIDMeta meta={{ ...fixtureDIDMetaViewModel(), name: NAME }} />);
        expect(screen.getByTestId('ami-tags-row')).toHaveTextContent(NAME);
    });

    it('ListDIDMeta passes the DID name to AMITagsRow', () => {
        render(<ListDIDMeta meta={{ ...fixtureDIDMetaViewModel(), name: NAME }} isLoading={false} hasError={false} />);
        expect(screen.getByTestId('ami-tags-row')).toHaveTextContent(NAME);
    });
});
