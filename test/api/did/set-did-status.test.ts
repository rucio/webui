import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { SetDIDStatusRequest } from '@/lib/core/usecase-models/set-did-status-usecase-models';
import { SetDIDStatusControllerParameters } from '@/lib/infrastructure/controller/set-did-status-controller';

describe('Set DID status API Tests', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const addDIDMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dataset1/status`,
            method: 'PUT',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: '',
            },
            requestValidator: async req => {
                const jsonBody = await req.json();
                console.log(jsonBody);
                return jsonBody.open !== undefined;
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [addDIDMockEndpoint]);
    });
    afterEach(() => {
        fetchMock.dontMock();
    });
    it('should return a base view model signifying success', async () => {
        const { req, res, session } = await createHttpMocks('/api/set-did-status', 'PUT', {});

        const setDIDStatusController = appContainer.get<BaseController<SetDIDStatusControllerParameters, SetDIDStatusRequest>>(
            CONTROLLERS.SET_DID_STATUS,
        );
        const setDIDStatusControllerParams: SetDIDStatusControllerParameters = {
            name: 'dataset1',
            scope: 'test',
            open: true,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
        };
        await setDIDStatusController.execute(setDIDStatusControllerParams);
        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        expect(data.status).toBe('success');
    });
});
