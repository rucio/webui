import ListDIDsPresenter from '@/lib/infrastructure/presenter/list-dids-presenter';
import { ListDIDsResponse } from '@/lib/core/usecase-models/list-dids-usecase-models';
import { DIDType } from '@/lib/core/entity/rucio';

const makePresenter = () => new ListDIDsPresenter({} as any);

describe('ListDIDsPresenter envelope handling', () => {
    it('passes a DID record through with its fields intact', () => {
        const response = {
            status: 'success',
            kind: 'did',
            name: 'dataset1',
            scope: 'test',
            did_type: DIDType.DATASET,
            bytes: 1,
            length: 2,
            open: true,
        } as ListDIDsResponse;

        expect(makePresenter().streamResponseModelToViewModel(response)).toEqual({
            status: 'success',
            kind: 'did',
            name: 'dataset1',
            scope: 'test',
            did_type: DIDType.DATASET,
            bytes: 1,
            length: 2,
            open: true,
        });
    });

    it('treats a record with no kind as a DID record', () => {
        const response = {
            status: 'success',
            name: 'dataset1',
            scope: 'test',
            did_type: DIDType.DATASET,
            bytes: 0,
            length: 0,
            open: false,
        } as ListDIDsResponse;

        expect(makePresenter().streamResponseModelToViewModel(response).kind).toEqual('did');
    });

    it('carries a progress record through without DID fields', () => {
        const response = {
            status: 'success',
            kind: 'progress',
            progress: { types: [DIDType.CONTAINER, DIDType.DATASET], state: 'searching' },
        } as ListDIDsResponse;

        const viewModel = makePresenter().streamResponseModelToViewModel(response);
        expect(viewModel.kind).toEqual('progress');
        expect(viewModel.progress).toEqual({ types: [DIDType.CONTAINER, DIDType.DATASET], state: 'searching' });
        expect(viewModel.name).toEqual('');
    });

    it('carries a notice record with its code', () => {
        const response = {
            status: 'success',
            kind: 'notice',
            notice: { code: 'refine-wildcard', message: 'Please refine the DID name.' },
        } as ListDIDsResponse;

        const viewModel = makePresenter().streamResponseModelToViewModel(response);
        expect(viewModel.kind).toEqual('notice');
        expect(viewModel.notice?.code).toEqual('refine-wildcard');
    });
});
