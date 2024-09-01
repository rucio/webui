import { DefaultBodyType, http, HttpResponse, StrictRequest } from 'msw';

export interface MockStreamOptions {
    data: any[];
    delay?: number;
    isRequestValid?: (request: StrictRequest<DefaultBodyType>) => boolean;
}

const encoder = new TextEncoder();

export const getMockStreamEndpoint = (url: string, options: MockStreamOptions) => {
    return http.get(url, async ({ request }) => {
        const { data, delay, isRequestValid } = options;
        if (isRequestValid) {
            if (!isRequestValid(request)) {
                return HttpResponse.json(
                    { message: 'Unsuccessful validation' },
                    {
                        status: 400,
                    },
                );
            }
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

        return new Response(stream, {
            headers: {
                'Content-Type': 'application/json',
                'Transfer-Encoding': 'chunked',
            },
        });
    });
};
