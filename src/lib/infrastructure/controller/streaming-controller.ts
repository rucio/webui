import { injectable } from 'inversify';
import { NextApiResponse } from 'next';

export interface IStreamingController {
    stream(response: NextApiResponse): void;
}

@injectable()
class StreamingController implements IStreamingController {
    async stream(response: NextApiResponse) {
        response.status(200).send('Hello World');
    }
}

export default StreamingController;
