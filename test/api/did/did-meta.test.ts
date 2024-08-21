import { DIDMetaRequest } from '@/lib/core/usecase-models/did-meta-usecase-models';
import { DIDMetaControllerParameters } from '@/lib/infrastructure/controller/did-meta-controller';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

describe('DID Meta API Tests', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const didMetaMMockEndpoint: MockEndpoint = {
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
                    account: 'root',
                    did_type: 'DATASET',
                    is_open: true,
                    monotonic: false,
                    hidden: false,
                    obsolete: false,
                    complete: null,
                    is_new: true,
                    availability: 'AVAILABLE',
                    suppressed: false,
                    bytes: null,
                    length: null,
                    md5: null,
                    adler32: null,
                    expired_at: null,
                    purge_replicas: true,
                    deleted_at: null,
                    events: null,
                    guid: null,
                    project: null,
                    datatype: null,
                    run_number: null,
                    stream_name: null,
                    prod_step: null,
                    version: null,
                    campaign: null,
                    task_id: null,
                    panda_id: null,
                    lumiblocknr: null,
                    provenance: null,
                    phys_group: null,
                    transient: false,
                    accessed_at: null,
                    closed_at: null,
                    eol_at: null,
                    is_archive: null,
                    constituent: null,
                    access_cnt: null,
                    created_at: 'Mon, 10 Jul 2023 13:23:56 UTC',
                    updated_at: 'Mon, 10 Jul 2023 13:23:56 UTC',
                }),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [didMetaMMockEndpoint]);
    });
    afterEach(() => {
        fetchMock.dontMock();
    });
    it('should return a DIDMetaViewModel', async () => {
        const { req, res, session } = await createHttpMocks('/api/did-meta', 'GET', {});

        const didMetaController = appContainer.get<BaseController<DIDMetaControllerParameters, DIDMetaRequest>>(CONTROLLERS.DID_META);
        const didMetaControllerParams: DIDMetaControllerParameters = {
            name: 'dataset1',
            scope: 'test',
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
        };
        await didMetaController.execute(didMetaControllerParams);
        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        expect(data.status).toBe('success');
        expect(data.name).toBe('dataset1');
        expect(data.scope).toBe('test');
        expect(data.account).toBe('root');
        expect(data.did_type).toBe('Dataset');
        expect(data.is_open).toBe(true);
        expect(data.created_at).toBe('Mon, 10 Jul 2023 13:23:56 UTC');
    });
});
