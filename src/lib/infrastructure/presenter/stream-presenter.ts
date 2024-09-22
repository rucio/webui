import StreamOutputPort from '@/lib/core/port/primary/stream-output-port';
import { NextApiResponse } from 'next';

export default class StreamPresenter implements StreamOutputPort<NextApiResponse> {
    response: NextApiResponse<any>;
    constructor(response: NextApiResponse) {
        this.response = response;
    }
    presentData(data: NextApiResponse<any>): void {
        throw new Error('Method not implemented.');
    }
    presentError(error: Error): void {
        throw new Error('Method not implemented.');
    }
}
