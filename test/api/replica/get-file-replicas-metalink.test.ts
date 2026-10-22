import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { GetFileReplicasMetalinkControllerParameters } from '@/lib/infrastructure/controller/get-file-replicas-metalink-controller';
import { GetFileReplicasMetalinkRequest } from '@/lib/core/usecase-models/get-file-replicas-metalink-usecase-models';

const METALINK = '<?xml version="1.0" encoding="UTF-8"?>\n<metalink xmlns="urn:ietf:params:xml:ns:metalink"></metalink>\n';

describe('Get File Replicas Metalink Feature tests', () => {
    let rucioCalled = false;

    const mockMetalink = (status: number, body: string, headers: Record<string, string>) => {
        const endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/replicas/list`,
            method: 'POST',
            includes: 'replicas/list',
            requestValidator: async () => {
                rucioCalled = true;
                return true;
            },
            response: { status, headers, body },
        };
        MockRucioServerFactory.createMockRucioServer(true, [endpoint]);
    };

    const execute = async (params: Partial<GetFileReplicasMetalinkControllerParameters>) => {
        const res = MockHttpStreamableResponseFactory.getMockResponse();
        const controller = appContainer.get<BaseController<GetFileReplicasMetalinkControllerParameters, GetFileReplicasMetalinkRequest>>(
            CONTROLLERS.GET_FILE_REPLICAS_METALINK,
        );
        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            scope: 'test',
            name: 'file1',
            ...params,
        } as GetFileReplicasMetalinkControllerParameters);
        return res;
    };

    beforeEach(() => {
        fetchMock.doMock();
        rucioCalled = false;
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    it('returns the metalink document', async () => {
        mockMetalink(200, METALINK, { 'Content-Type': 'application/metalink4+xml' });

        const res = await execute({});

        expect(res._getStatusCode()).toBe(200);
        expect(res._getJSONData()).toEqual({ status: 'success', xml: METALINK });
    });

    it('rejects an unknown domain before calling Rucio', async () => {
        mockMetalink(200, METALINK, { 'Content-Type': 'application/metalink4+xml' });

        const res = await execute({ domain: 'bogus' as any });

        expect(res._getStatusCode()).toBe(400);
        expect(res._getJSONData()).toMatchObject({ status: 'error', errorType: 'invalid_domain' });
        expect(rucioCalled).toBe(false);
    });

    it('maps InvalidRSEExpression to a 400 with a typed error', async () => {
        mockMetalink(500, JSON.stringify({ ExceptionClass: 'InvalidRSEExpression', ExceptionMessage: 'RSE Expression resulted in an empty set.' }), {
            'Content-Type': 'application/json',
            ExceptionClass: 'InvalidRSEExpression',
        });

        const res = await execute({ rseExpression: 'NOPE' });

        expect(res._getStatusCode()).toBe(400);
        expect(res._getJSONData()).toMatchObject({ status: 'error', errorType: 'invalid_rse_expression', xml: '' });
    });

    it('maps an expired token to unauthorized', async () => {
        mockMetalink(200, METALINK, { 'Content-Type': 'application/metalink4+xml' });

        const res = await execute({ rucioAuthToken: 'expired' });

        expect(res._getStatusCode()).toBe(401);
        expect(res._getJSONData()).toMatchObject({ status: 'error', errorType: 'unauthorized' });
    });
});
