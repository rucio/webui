import { GetFTSLinkRequest } from '@/lib/core/usecase-models/get-fts-link-usecase-models';
import { GetFTSLinkControllerParameters } from '@/lib/infrastructure/controller/get-fts-link-controller';
import { FTSLinkViewModel } from '@/lib/infrastructure/data/view-model/request';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

describe('GET FTS link API Test', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const requestMock = {
            source_rse_id: 'cc28f83ca733482d81f80ba7e6cdd7db',
            previous_attempt_id: null,
            started_at: null,
            staging_started_at: null,
            updated_at: 'Fri, 27 Jun 2025 15:57:36 UTC',
            attributes: {
                activity: 'User Subscriptions',
                source_replica_expression: null,
                lifetime: null,
                ds_scope: null,
                ds_name: null,
                bytes: 10485760,
                md5: 'c495e4f8272b0c6f0249856922d854ab',
                adler32: 'ed64d306',
                priority: 3,
                allow_tape_source: true,
            },
            rule_id: 'acd1de2771794fd4af5d4d500f086cca',
            transferred_at: null,
            staging_finished_at: null,
            request_type: 'TRANSFER',
            state: 'SUBMITTED',
            activity: 'User Subscriptions',
            estimated_at: null,
            account: 'root',
            id: 'a5ea7890453d42f2882520ec503b367c',
            external_id: '71ce2e5a-536f-11f0-bb60-2a078b4f5cd0',
            bytes: 10485760,
            submitter_id: null,
            requested_at: null,
            scope: 'test',
            external_host: 'https://fts:8446',
            md5: 'c495e4f8272b0c6f0249856922d854ab',
            last_processed_by: null,
            priority: 3,
            name: 'file2',
            retry_count: 0,
            adler32: 'ed64d306',
            estimated_started_at: null,
            last_processed_at: null,
            did_type: 'FILE',
            err_msg: null,
            dest_url: 'root://xrd2:1095//rucio/test/f3/14/file2',
            estimated_transferred_at: null,
            transfertool: 'fts3',
            dest_rse_id: '2cf75efc49ef4441b87efbcc7a95a92f',
            submitted_at: 'Fri, 27 Jun 2025 15:57:36 UTC',
            created_at: 'Fri, 27 Jun 2025 15:56:28 UTC',
            source_rse: 'XRD1',
            dest_rse: 'XRD2',
        };

        const getRequestEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/requests/test/file2/XRD2`,
            method: 'GET',
            includes: '/requests/test/file2/XRD2',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestMock),
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [getRequestEndpoint]);
    });
    afterEach(() => {
        fetchMock.dontMock();
    });

    test('it should form url for the request', async () => {
        const { req, res, session } = await createHttpMocks('/api/feature/get-fts-link?scope=test&name=file2&rse=XRD2', 'GET', {});
        const getFTSLinkController = appContainer.get<BaseController<GetFTSLinkControllerParameters, GetFTSLinkRequest>>(CONTROLLERS.GET_FTS_LINK);
        const getFTSLinkControllerParameters: GetFTSLinkControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            scope: 'test',
            name: 'file2',
            rse: 'XRD2',
        };
        await getFTSLinkController.execute(getFTSLinkControllerParameters);
        const data = await res._getJSONData();
        expect(data).toEqual({
            status: 'success',
            url: 'https://fts:8449/ftsmon/#/job/71ce2e5a-536f-11f0-bb60-2a078b4f5cd0',
        } as FTSLinkViewModel);
    });
});
