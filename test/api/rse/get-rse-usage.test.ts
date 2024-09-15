import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { GetRSEUsageControllerParameters } from '@/lib/infrastructure/controller/get-rse-usage-controller';
import { GetRSEUsageRequest } from '@/lib/core/usecase-models/get-rse-usage-usecase-models';
import { RSEUsageViewModel } from '@/lib/infrastructure/data/view-model/rse-usage';

describe('GET RSE Usage API Test', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const usage = {
            rse_id: '55a218820c3c4089a1eb74e299de40de',
            source: 'rucio',
            used: 41943040,
            free: null,
            total: 41943040,
            files: 4,
            updated_at: 'Wed, 21 Aug 2024 08:43:24 UTC',
            rse: 'XRD3',
        };

        const getRSEUsageEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rses/XRD3/usage`,
            method: 'GET',
            includes: 'rses',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usage),
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [getRSEUsageEndpoint]);
    });
    afterEach(() => {
        fetchMock.dontMock();
    });

    test('It should get usage for an RSE', async () => {
        const { req, res, session } = await createHttpMocks('/api/feature/get-rse?rseName=XRD3', 'GET', {});
        const getRSEUsageController = appContainer.get<BaseController<GetRSEUsageControllerParameters, GetRSEUsageRequest>>(
            CONTROLLERS.GET_RSE_USAGE,
        );
        const getRSEUsageControllerParameters: GetRSEUsageControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            rseName: 'XRD3',
        };
        await getRSEUsageController.execute(getRSEUsageControllerParameters);
        const data = await res._getJSONData();
        expect(data).toEqual({
            status: 'success',
            rse_id: '55a218820c3c4089a1eb74e299de40de',
            source: 'rucio',
            used: 41943040,
            free: null,
            total: 41943040,
            files: 4,
            updated_at: 'Wed, 21 Aug 2024 08:43:24 UTC',
            rse: 'XRD3',
        } as RSEUsageViewModel);
    });
});
