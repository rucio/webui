import { DefaultBodyType, http, HttpResponse, StrictRequest } from 'msw';

export interface MockStreamOptions {
    data: any[];
    delay?: number;
    isRequestValid?: (request: StrictRequest<DefaultBodyType>) => boolean;
}

const encoder = new TextEncoder();
const streamHeaders = {
    'Content-Type': 'application/json',
    'Transfer-Encoding': 'chunked',
};
const getBadRequestResponse = () =>
    HttpResponse.json(
        { message: 'Unsuccessful validation' },
        {
            status: 400,
        },
    );

export const getMockStreamEndpoint = (url: string, options: MockStreamOptions) => {
    return http.get(url, async ({ request }) => {
        const { data, delay, isRequestValid } = options;
        if (isRequestValid && !isRequestValid(request)) {
            return getBadRequestResponse();
        }

        // Create a readable stream to simulate streaming data
        const stream = new ReadableStream({
            async start(controller) {
                for (const element of data) {
                    const jsonString = JSON.stringify(element) + '\n';
                    controller.enqueue(encoder.encode(jsonString));
                    if (delay) {
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
                controller.close();
            },
        });

        return new Response(stream, { headers: streamHeaders });
    });
};

export const getMockInvalidStreamEndpoint = (url: string) => {
    return http.get(url, async () => {
        // Create a stream that is not valid ndjson
        const stream = new ReadableStream({
            async start(controller) {
                const jsonString = '{test.failing}\nbad:formatting';
                controller.enqueue(encoder.encode(jsonString));
                controller.close();
            },
        });

        return new Response(stream, { headers: streamHeaders });
    });
};

const splitStringRandomly = (str: string): string[] => {
    const chunkCount = Math.floor(Math.random() * (str.length - 1)) + 1;

    // Generate random split points
    const splitPoints: Set<number> = new Set();
    while (splitPoints.size < chunkCount - 1) {
        const randomIndex = Math.floor(Math.random() * (str.length - 1)) + 1;
        splitPoints.add(randomIndex);
    }

    // Convert split points into a sorted array
    const sortedPoints = [...splitPoints].sort((a, b) => a - b);

    // Split the string at the sorted points
    const chunks = [];
    let prevIndex = 0;

    for (const point of sortedPoints) {
        chunks.push(str.slice(prevIndex, point));
        prevIndex = point;
    }

    // Add the last chunk from the final split point to the end
    chunks.push(str.slice(prevIndex));

    return chunks;
};

// Pushes random partial chunks which combine into a valid ndjson
export const getMockPartialStreamEndpoint = (url: string, options: MockStreamOptions) => {
    return http.get(url, async ({ request }) => {
        const { data, delay, isRequestValid } = options;
        if (isRequestValid && !isRequestValid(request)) {
            return getBadRequestResponse();
        }

        const stream = new ReadableStream({
            async start(controller) {
                let jsonString = '';
                for (const element of data) {
                    jsonString += JSON.stringify(element) + '\n';
                }

                const chunks = splitStringRandomly(jsonString);
                for (const chunk of chunks) {
                    controller.enqueue(encoder.encode(chunk));
                    if (delay) {
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }

                controller.close();
            },
        });

        return new Response(stream, { headers: streamHeaders });
    });
};
