import { Transform } from 'stream'

export async function collectStreamedData<TStreamData>(stream: Transform | any): Promise<TStreamData[]> {
    const receivedData: TStreamData[] = []
    const onData = (data: TStreamData) => {
        receivedData.push(data)
    }
    await new Promise((resolve, reject) => {
        stream.on('data', onData)
        stream.on('end', resolve)
        stream.on('error', reject)
    });
    return receivedData
}