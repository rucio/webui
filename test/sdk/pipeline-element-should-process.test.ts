import GetDIDsPipelineElement from '@/lib/core/use-case/list-dids/pipeline-element-get-did';
import { DIDType } from '@/lib/core/entity/rucio';
import { collectStreamedData } from '@/lib/sdk/utils';
import { Readable } from 'stream';

const requestModel = { rucioAuthToken: 'token', query: 'test:*', type: DIDType.ALL, filters: [] };

const chunk = (responseModel: object) => ({ status: 'success', requestModel, responseModel });

describe('GetDIDsPipelineElement record filtering', () => {
    it('forwards progress and notice records without calling the DID gateway', async () => {
        const getDID = jest.fn();
        const element = new GetDIDsPipelineElement({ getDID } as any);

        const progress = { status: 'success', kind: 'progress', progress: { types: [DIDType.CONTAINER], state: 'searching' } };
        const notice = { status: 'success', kind: 'notice', notice: { code: 'files-skipped', message: 'Files were not searched.' } };

        const source = Readable.from([chunk(progress), chunk(notice)], { objectMode: true });
        source.pipe(element);

        const received: any[] = await collectStreamedData(element);

        // Neither carries a scope or name, so a lookup would be made against nothing.
        expect(getDID).not.toHaveBeenCalled();
        expect(received.map(r => r.responseModel)).toEqual([progress, notice]);
    });

    it('still processes DID records through the gateway', async () => {
        const getDID = jest.fn().mockResolvedValue({
            status: 'success',
            scope: 'test',
            name: 'dataset1',
            did_type: DIDType.DATASET,
            bytes: 1,
            length: 2,
            open: true,
            expired_at: '',
        });
        const element = new GetDIDsPipelineElement({ getDID } as any);

        const did = { status: 'success', kind: 'did', scope: 'test', name: 'dataset1' };
        const source = Readable.from([chunk(did)], { objectMode: true });
        source.pipe(element);

        await collectStreamedData(element);

        expect(getDID).toHaveBeenCalledTimes(1);
    });
});
