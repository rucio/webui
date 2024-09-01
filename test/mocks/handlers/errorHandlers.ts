import {http, HttpResponse} from 'msw';

export interface MockErrorOptions {
    statusCode: number,
    message: string
}

export const getMockErrorEndpoint = (url: string, options: MockErrorOptions) => {
    return http.get(url, async ({request}) => {
        const {statusCode, message} = options;
        return HttpResponse.json(
            {message: message},
            {
                status: statusCode,
            },
        );

    });
};
