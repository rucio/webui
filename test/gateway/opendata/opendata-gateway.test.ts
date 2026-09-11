import 'reflect-metadata';
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
import ListOpenDataDIDsEndpoint from '@/lib/infrastructure/gateway/opendata-gateway/endpoints/list-opendata-dids-endpoint';
import RucioOpenDataGateway from '@/lib/infrastructure/gateway/opendata-gateway/opendata-gateway';

describe('RucioOpenDataGateway', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('listOpenDataDIDs', () => {
        it('maps a 404 from the OpenData collection endpoint to opendata_unsupported', async () => {
            jest.spyOn(ListOpenDataDIDsEndpoint.prototype, 'fetch').mockResolvedValue({
                status: 'error',
                total: 0,
                offset: 0,
                dids: [],
                errorName: 'Not Found',
                errorType: 'gateway_endpoint_error',
                errorCode: 404,
                errorMessage: 'The requested resource was not found.',
            });

            const gateway = new RucioOpenDataGateway();

            const dto = await gateway.listOpenDataDIDs('test-token', 50, 0);

            expect(dto).toEqual(
                expect.objectContaining({
                    status: 'error',
                    total: 0,
                    offset: 0,
                    dids: [],
                    errorName: 'OpenData Unsupported',
                    errorType: 'opendata_unsupported',
                    errorCode: 404,
                    errorMessage: 'OpenData is not supported by this Rucio server.',
                }),
            );
        });

        it('does not convert non-404 errors to opendata_unsupported', async () => {
            const gatewayError = {
                status: 'error' as const,
                total: 0,
                offset: 0,
                dids: [],
                errorName: 'Invalid Auth Token',
                errorType: 'gateway_endpoint_error',
                errorCode: 401,
                errorMessage: 'The provided authentication token is invalid or has expired.',
            };

            jest.spyOn(ListOpenDataDIDsEndpoint.prototype, 'fetch').mockResolvedValue(gatewayError);

            const gateway = new RucioOpenDataGateway();

            const dto = await gateway.listOpenDataDIDs('test-token', 50, 0);

            expect(dto).toEqual(gatewayError);
        });
    });

    describe('getOpenDataDID', () => {
        it('keeps a 404 for a single DID as a regular not-found error', async () => {
            jest.spyOn(GetOpenDataDIDEndpoint.prototype, 'fetch').mockResolvedValue({
                status: 'error',
                scope: 'mock',
                name: 'missing.root',
                files: [],
                meta: {},
                errorName: 'Not Found',
                errorType: 'gateway_endpoint_error',
                errorCode: 404,
                errorMessage: 'The requested resource was not found.',
            });

            const gateway = new RucioOpenDataGateway();

            const dto = await gateway.getOpenDataDID('test-token', 'mock', 'missing.root');

            expect(dto).toEqual(
                expect.objectContaining({
                    status: 'error',
                    errorCode: 404,
                    errorType: 'gateway_endpoint_error',
                }),
            );

            expect(dto.errorType).not.toBe('opendata_unsupported');
        });
    });
});
