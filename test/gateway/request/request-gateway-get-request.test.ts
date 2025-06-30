import RequestGatewayOutputPort from '@/lib/core/port/secondary/request-gateway-output-port';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

describe('RequestGateway GET Request Endpoint Tests', () => {
    const testData = {
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

    beforeEach(() => {
        fetchMock.doMock();
        const getRequestMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/requests/test/file2/XRD2`,
            method: 'GET',
            includes: '/requests/test/file2/XRD2',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData),
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [getRequestMockEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    test('should successfully fetch the whole Request', async () => {
        const requestGateway: RequestGatewayOutputPort = appContainer.get<RequestGatewayOutputPort>(GATEWAYS.REQUEST);
        const requestDTO = await requestGateway.getRequest(MockRucioServerFactory.VALID_RUCIO_TOKEN, 'test', 'file2', 'XRD2');
        expect(requestDTO).toEqual({
            status: 'success',
            data: testData,
        });
    });
});
