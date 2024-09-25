import { DefaultBodyType, http, HttpResponse, StrictRequest } from 'msw';

export interface MockSingleOptions {
    getData: () => any;
    getDelay?: () => number;
    method?: 'GET' | 'POST';
    isRequestValid?: (request: StrictRequest<DefaultBodyType>) => boolean;
}

const singleHeaders = {
    'Content-Type': 'application/json',
};

export const getMockSingleEndpoint = (url: string, options: MockSingleOptions) => {
    const resolver = async ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
        const { getData, getDelay, isRequestValid } = options;
        if (isRequestValid && !isRequestValid(request)) {
            return HttpResponse.json(
                { message: 'Unsuccessful validation' },
                {
                    status: 400,
                },
            );
        }

        const responseJson = JSON.stringify(getData());
        if (getDelay) {
            await new Promise(resolve => setTimeout(resolve, getDelay()));
        }

        return new Response(responseJson, { headers: singleHeaders });
    };

    if (options.method === 'POST') {
        return http.post(url, resolver);
    } else {
        return http.get(url, resolver);
    }
};
