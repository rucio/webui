import GetDIDsPipelineElement from '@/lib/core/use-case/list-dids/pipeline-element-get-did';
import { DIDType } from '@/lib/core/entity/rucio';
import { collectStreamedData } from '@/lib/sdk/utils';
import { Readable } from 'stream';

describe('GetDIDsPipelineElement record filtering', () => {
    it('forwards progress and notice records without calling the DID gateway', async () => {
        const getDID = jest.fn();
        const element = new GetDIDsPipelineElement({ getDID } as any);

        const progressChunk = {
            status: 'success',
            requestModel: { rucioAuthToken: 'token', query: 'test:*', type: DIDType.ALL, filters: [] },
            responseModel: {
                status: 'success',
                kind: 'progress',
                progress: { types: [DIDType.CONTAINER], state: 'searching' },
            },
        };

        const source = Readable.from([progressChunk], { objectMode: true });
        source.pipe(element);

        const received: any[] = await collectStreamedData(element);

        expect(getDID).not.toHaveBeenCalled();
        expect(received).toHaveLength(1);
        expect(received[0].responseModel.kind).toEqual('progress');
        expect(received[0].responseModel.progress).toEqual({ types: [DIDType.CONTAINER], state: 'searching' });
    });
});
