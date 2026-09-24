import { isRowRecord } from '@/lib/infrastructure/hooks/useTableStreaming';
import { DIDType } from '@/lib/core/entity/rucio';

describe('isRowRecord', () => {
    it('accepts a DID record', () => {
        expect(isRowRecord({ status: 'success', kind: 'did', name: 'container1' } as any)).toEqual(true);
    });

    it('accepts an untagged record, because absent kind means did', () => {
        expect(isRowRecord({ status: 'success', name: 'container1' } as any)).toEqual(true);
    });

    it('rejects a progress record', () => {
        expect(isRowRecord({ status: 'success', kind: 'progress', progress: { types: [DIDType.CONTAINER], state: 'searching' } } as any)).toEqual(
            false,
        );
    });

    it('rejects a notice record', () => {
        expect(isRowRecord({ status: 'success', kind: 'notice', notice: { code: 'no-results', message: '' } } as any)).toEqual(false);
    });

    it('rejects a progress record even though the validator would accept it', () => {
        // BaseViewModelValidator.isValid passes anything with status 'success',
        // so this predicate is the only thing keeping blank rows out of the grid.
        const progress = { status: 'success', kind: 'progress', progress: { types: [DIDType.FILE], state: 'empty' } } as any;
        expect(progress.status).toEqual('success');
        expect(isRowRecord(progress)).toEqual(false);
    });
});
