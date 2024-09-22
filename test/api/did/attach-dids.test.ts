import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { AttachDIDsControllerParameters } from '@/lib/infrastructure/controller/attach-dids-controller';
import { AttachDIDsRequest } from '@/lib/core/usecase-models/attach-dids-usecase-models';

describe('Attach DIDs API Tests', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const addDIDMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dataset1/dids`,
            method: 'POST',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: 'Created',
            },
            requestValidator: async req => {
                const jsonBody = await req.json();
                return jsonBody.dids !== undefined;
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [addDIDMockEndpoint]);
    });
    afterEach(() => {
        fetchMock.dontMock();
    });
    it('should return a base view model signifying success', async () => {
        const { req, res, session } = await createHttpMocks('/api/attach-dids', 'POST', {});

        const attachDIDsController = appContainer.get<BaseController<AttachDIDsControllerParameters, AttachDIDsRequest>>(CONTROLLERS.ATTACH_DIDS);
        const attachDIDsControllerParams: AttachDIDsControllerParameters = {
            name: 'dataset1',
            scope: 'test',
            dids: [
                {
                    scope: 'test',
                    name: 'file1',
                },
                {
                    scope: 'test',
                    name: 'file2',
                },
            ],
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
        };
        await attachDIDsController.execute(attachDIDsControllerParams);
        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        expect(data.status).toBe('success');
        expect(data.created).toBe(true);
    });
});
