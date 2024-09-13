import { DefaultBodyType, http, HttpResponse, StrictRequest } from 'msw';

export interface MockSingleOptions {
    getData: () => any;
    getDelay?: () => number;
    isRequestValid?: (request: StrictRequest<DefaultBodyType>) => boolean;
}

const singleHeaders = {
    'Content-Type': 'application/json',
};

export const getMockSingleEndpoint = (url: string, options: MockSingleOptions) => {
    return http.get(url, async ({ request }) => {
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
    });
};
