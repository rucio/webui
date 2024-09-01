import { DIDKeyValuePairsDataRequest } from '@/lib/core/usecase-models/did-keyvaluepairs-usecase-models';
import { DIDKeyValuePairsDataControllerParameters } from '@/lib/infrastructure/controller/did-keyvaluepairs-controller';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import { NextApiResponse } from 'next';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

describe('DID KeyValuePairs API Tests', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const didKeyValuePairsMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dataset1/meta`,
            method: 'GET',
            includes: 'test/dataset1/meta',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    scope: 'test',
                    name: 'dataset1',
                    bro: 'not here',
                    numberval: 123,
                }),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [didKeyValuePairsMockEndpoint]);
    });
    afterEach(() => {
        fetchMock.dontMock();
    });
    it('should return a DIDKeyValuePairsResponse', async () => {
        const { req, res, session } = await createHttpMocks('/api/did-keyvaluepairs', 'GET', {});
        const didKVController = appContainer.get<BaseController<DIDKeyValuePairsDataControllerParameters, DIDKeyValuePairsDataRequest>>(
            CONTROLLERS.DID_KEYVALUEPAIRS,
        );
        const didKVControllerParams: DIDKeyValuePairsDataControllerParameters = {
            name: 'test/dataset1',
            scope: 'test',
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
        };
        await didKVController.execute(didKVControllerParams);
        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        expect(data.status).toBe('success');
        expect(data.data).toHaveLength(4);
        expect(data.data).toContainEqual({ key: 'scope', value: 'test' });
        expect(data.data).toContainEqual({ key: 'numberval', value: 123 });
    });
});
