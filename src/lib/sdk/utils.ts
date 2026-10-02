import { Readable, Transform } from 'stream';

export async function collectStreamedData<TStreamData>(stream: Transform | any): Promise<TStreamData[]> {
    const receivedData: TStreamData[] = [];
    const onData = (data: TStreamData) => {
        receivedData.push(data);
    };
    await new Promise((resolve, reject) => {
        stream.on('data', onData);
        stream.on('end', resolve);
        stream.on('error', reject);
    });
    return receivedData;
}

/**
 * Determines whether a stream will produce any data, without consuming it.
 *
 * The stream must not have a consumer attached yet. Any chunk read during the
 * probe is unshifted back so the eventual consumer still sees it.
 *
 * At EOF, 'readable' fires and read() returns null, then 'end' fires. So a
 * null read is never conclusive on its own and is simply ignored; 'end' is
 * what resolves the empty case.
 *
 * @param source The stream to probe.
 * @returns true if the stream ended without producing data.
 */
export function isStreamEmpty(source: Readable): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const cleanup = () => {
            source.off('readable', onReadable);
            source.off('end', onEnd);
            source.off('error', onError);
        };

        const onReadable = () => {
            const chunk = source.read();
            if (chunk === null) return;
            source.unshift(chunk);
            cleanup();
            resolve(false);
        };

        const onEnd = () => {
            cleanup();
            resolve(true);
        };

        const onError = (error: Error) => {
            cleanup();
            reject(error);
        };

        source.on('readable', onReadable);
        source.once('end', onEnd);
        source.once('error', onError);
    });
}
