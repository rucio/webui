import { DIDMetaRequest } from '@/lib/core/usecase-models/did-meta-usecase-models';
import { DIDMetaControllerParameters } from '@/lib/infrastructure/controller/did-meta-controller';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { AddDIDControllerParameters } from '@/lib/infrastructure/controller/add-did-controller';
import { AddDIDRequest } from '@/lib/core/usecase-models/add-did-usecase-models';

describe('Add DID API Tests', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const addDIDMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dataset1`,
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
                return jsonBody.type !== undefined;
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [addDIDMockEndpoint]);
    });
    afterEach(() => {
        fetchMock.dontMock();
    });
    it('should return a base view model signifying success', async () => {
        const { req, res, session } = await createHttpMocks('/api/add-did', 'POST', {});

        const addDIDController = appContainer.get<BaseController<AddDIDControllerParameters, AddDIDRequest>>(CONTROLLERS.ADD_DID);
        const addDIDControllerParams: AddDIDControllerParameters = {
            name: 'dataset1',
            scope: 'test',
            type: 'Dataset',
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
        };
        await addDIDController.execute(addDIDControllerParams);
        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        expect(data.status).toBe('success');
    });
    it('should discard requests with wrong type', async () => {
        const { req, res, session } = await createHttpMocks('/api/add-did', 'POST', {});

        const addDIDController = appContainer.get<BaseController<AddDIDControllerParameters, AddDIDRequest>>(CONTROLLERS.ADD_DID);
        const addDIDControllerParams: AddDIDControllerParameters = {
            name: 'dataset1',
            scope: 'test',
            type: 'Wrong',
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
        };
        await addDIDController.execute(addDIDControllerParams);
        expect(res._getStatusCode()).toBe(400);
        const data = JSON.parse(res._getData());
        expect(data.status).toBe('error');
    });
});
