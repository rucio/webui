const mockRucioHost = jest.fn().mockResolvedValue('https://rucio.example');

jest.mock('@/lib/infrastructure/ioc/container-config', () => ({
    __esModule: true,
    default: {
        get: jest.fn(() => ({
            rucioHost: mockRucioHost,
        })),
    },
}));

import GetOpenDataDIDEndpoint from '@/lib/infrastructure/gateway/opendata-gateway/endpoints/get-opendata-did-endpoint';

describe('GetOpenDataDIDEndpoint', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('preserves HTTP 404 when the OpenData DID does not exist', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue(
            new Response(
                JSON.stringify({
                    error: 'DID not found',
                }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            ),
        );

        const endpoint = new GetOpenDataDIDEndpoint('test-token', 'mock', 'missing.root');

        const dto = await endpoint.fetch();

        expect(fetch).toHaveBeenCalledTimes(1);

        expect(dto).toEqual(
            expect.objectContaining({
                status: 'error',
                errorCode: 404,
                errorType: 'gateway_endpoint_error',
            }),
        );
    });
});
