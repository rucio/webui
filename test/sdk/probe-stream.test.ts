import { isStreamEmpty, collectStreamedData } from '@/lib/sdk/utils';
import { PassThrough, Readable } from 'stream';

describe('isStreamEmpty', () => {
    it('reports a stream with data as not empty', async () => {
        const source = Readable.from([{ name: 'a' }, { name: 'b' }], { objectMode: true });
        await expect(isStreamEmpty(source)).resolves.toEqual(false);
    });

    it('leaves every element readable afterwards', async () => {
        const source = Readable.from([{ name: 'a' }, { name: 'b' }], { objectMode: true });

        await isStreamEmpty(source);

        const received = await collectStreamedData<{ name: string }>(source);
        expect(received).toEqual([{ name: 'a' }, { name: 'b' }]);
    });

    it('reports an immediately-ended stream as empty', async () => {
        const source = Readable.from([], { objectMode: true });
        await expect(isStreamEmpty(source)).resolves.toEqual(true);
    });

    it('reports a stream that ends later with no data as empty', async () => {
        const source = new PassThrough({ objectMode: true });
        setTimeout(() => source.end(), 10);
        await expect(isStreamEmpty(source)).resolves.toEqual(true);
    });

    it('rejects when the stream errors', async () => {
        const source = new PassThrough({ objectMode: true });
        setTimeout(() => source.destroy(new Error('boom')), 10);
        await expect(isStreamEmpty(source)).rejects.toThrow('boom');
    });
});
