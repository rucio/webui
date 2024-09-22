import { GetRSEAttributesRequest } from '@/lib/core/usecase-models/get-rse-attributes-usecase-models';
import { GetRSERequest } from '@/lib/core/usecase-models/get-rse-usecase-models';
import { GetRSEAttributesControllerParameters } from '@/lib/infrastructure/controller/get-rse-attributes-controller';
import { GetRSEControllerParameters } from '@/lib/infrastructure/controller/get-rse-controller';
import { RSEAttributeViewModel, RSEViewModel } from '@/lib/infrastructure/data/view-model/rse';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

describe('GET RSE Attributes API Test', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const getRSEAttributesMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rses/MOCK3/attr`,
            method: 'GET',
            includes: '/rses/MOCK3/attr',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ISP: 'CERN- LHC',
                    MOCK3: true,
                    continent: 'EU',
                    country_name: 'Switzerland',
                    region_code: '07',
                    time_zone: 'Europe/Zurich',
                }),
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [getRSEAttributesMockEndpoint]);
    });
    afterEach(() => {
        fetchMock.dontMock();
    });

    test('it should get attributes for an RSE', async () => {
        const { req, res, session } = await createHttpMocks('/api/feature/get-rse?rseName=DINGDONGRSE', 'GET', {});
        const controller = appContainer.get<BaseController<GetRSEAttributesControllerParameters, GetRSEAttributesRequest>>(
            CONTROLLERS.GET_RSE_ATTRIBUTES,
        );
        const controllerParameters: GetRSEControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            rseName: 'MOCK3',
        };
        await controller.execute(controllerParameters);
        const data = await res._getJSONData();
        expect(data).toEqual({
            status: 'success',
            attributes: [
                {
                    key: 'ISP',
                    value: 'CERN- LHC',
                },
                {
                    key: 'MOCK3',
                    value: true,
                },
                {
                    key: 'continent',
                    value: 'EU',
                },
                {
                    key: 'country_name',
                    value: 'Switzerland',
                },
                {
                    key: 'region_code',
                    value: '07',
                },
                {
                    key: 'time_zone',
                    value: 'Europe/Zurich',
                },
            ],
        } as RSEAttributeViewModel);
    });
});
