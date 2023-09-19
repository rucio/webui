import { GetRSERequest } from "@/lib/core/usecase-models/get-rse-usecase-models";
import { GetRSEControllerParameters } from "@/lib/infrastructure/controller/get-rse-controller";
import { RSEViewModel } from "@/lib/infrastructure/data/view-model/rse";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiResponse } from "next";
import { createHttpMocks } from "test/fixtures/http-fixtures";
import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";

describe('GET RSE API Test', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const rse = {
            id: 'abcd',
            rse: 'DINGDONGRSE',
            rse_type: 'DISK',
            volatile: false,
            deterministic: true,
            staging_area: false,
        }

        const getRSEEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rses/DINGDONGRSE`,
            method: 'GET',
            includes: 'rses',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rse)
            }
        }

        MockRucioServerFactory.createMockRucioServer(true, [getRSEEndpoint]);
    })
    afterEach(() => {
        fetchMock.dontMock();
    })

    test('it should get details for an RSE', async () => {
        const { req, res, session } = await createHttpMocks('/api/feature/get-rse?rseName=DINGDONGRSE', 'GET', {});
        const getRSEController = appContainer.get<BaseController<GetRSEControllerParameters, GetRSERequest>>(CONTROLLERS.GET_RSE)
        const getRSEControllerParameters: GetRSEControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            rseName: 'DINGDONGRSE',
        }
        await getRSEController.execute(getRSEControllerParameters)
        const data = await res._getJSONData()
        expect(data).toEqual({
            status: 'success',
            id: 'abcd',
            name: 'DINGDONGRSE',
            rse_type: 'DISK',
            volatile: false,
            deterministic: true,
            staging_area: false,
        } as RSEViewModel)
    })
})