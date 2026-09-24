import { render, screen } from '@testing-library/react';
import { DetailsDIDMeta } from '@/component-library/pages/DID/details/DetailsDIDMeta';
import { ListDIDMeta } from '@/component-library/pages/DID/list/meta/ListDIDMeta';
import { DIDMetaViewModel } from '@/lib/infrastructure/data/view-model/did';
import { DIDAvailability, DIDType } from '@/lib/core/entity/rucio';

jest.mock('@/component-library/features/ami/AMITagsRow', () => ({
    AMITagsRow: ({ name }: { name: string }) => <div data-testid="ami-tags-row">{name}</div>,
}));
jest.mock('@/component-library/features/panda/PandaTaskRow', () => ({
    PandaTaskRow: ({ name }: { name: string }) => <div data-testid="panda-task-row">{name}</div>,
}));

const NAME = 'data26_hi.00523138.physics_HardProbes.merge.AOD.f1723_m2281._lb0490._0003.1';

// Built inline rather than via test/fixtures/table-fixtures: that module imports
// @faker-js/faker, which is ESM-only from v10 and not transformed by the component project.
function didMeta(name: string): DIDMetaViewModel {
    return {
        status: 'success',
        scope: 'data26_hi',
        name,
        account: 'root',
        did_type: DIDType.DATASET,
        created_at: '2026-09-23T10:00:00.000Z',
        updated_at: '2026-09-23T10:00:00.000Z',
        availability: DIDAvailability.AVAILABLE,
        obsolete: false,
        hidden: false,
        suppressed: false,
        purge_replicas: true,
        monotonic: false,
        is_open: true,
        adler32: null,
        md5: null,
        guid: null,
        bytes: null,
    };
}

describe('AMITagsRow wiring', () => {
    it('DetailsDIDMeta passes the DID name to AMITagsRow', () => {
        render(<DetailsDIDMeta meta={didMeta(NAME)} />);
        expect(screen.getByTestId('ami-tags-row')).toHaveTextContent(NAME);
        expect(screen.getByTestId('panda-task-row')).toHaveTextContent(NAME);
    });

    it('ListDIDMeta passes the DID name to AMITagsRow', () => {
        render(<ListDIDMeta meta={didMeta(NAME)} isLoading={false} hasError={false} />);
        expect(screen.getByTestId('ami-tags-row')).toHaveTextContent(NAME);
        expect(screen.getByTestId('panda-task-row')).toHaveTextContent(NAME);
    });
});
