import { BaseController } from '@/lib/sdk/controller';
import { ListDIDsRequest } from '@/lib/core/usecase-models/list-dids-usecase-models';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { ListDIDsControllerParameters } from '@/lib/infrastructure/controller/list-dids-controller';
import { NextApiResponse } from 'next';
import { Readable } from 'stream';
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { DIDLong, DIDType } from '@/lib/core/entity/rucio';
import { TRucioExtendedDID } from '@/lib/infrastructure/gateway/did-gateway/did-gateway-utils';
import { collectStreamedData } from '@/lib/sdk/utils';
import { ListExtendedDIDsControllerParameters } from '@/lib/infrastructure/controller/list-extended-dids-controller';
import { ListExtendedDIDsRequest } from '@/lib/core/usecase-models/list-extended-dids-usecase-models';

describe('DID API Tests', () => {
    beforeEach(() => {
        fetchMock.doMock();
    });
    afterEach(() => {
        fetchMock.dontMock();
    });

    it('Should successfully stream extended DIDs', async () => {
        const dids: TRucioExtendedDID[] = [
            {
                scope: 'test',
                name: 'dataset1',
                type: 'Dataset',
                account: 'root',
                open: true,
                monotonic: false,
                expired_at: 'Fri, 14 Mar 2025 14:37:37 UTC',
                length: 0,
                bytes: 0,
            },
            {
                scope: 'test',
                name: 'dataset2',
                type: 'Dataset',
                account: 'root',
                open: true,
                monotonic: false,
                expired_at: 'Fri, 14 Mar 2025 14:37:37 UTC',
                length: 0,
                bytes: 0,
            },
            {
                scope: 'test',
                name: 'dataset3',
                type: 'Dataset',
                account: 'root',
                open: true,
                monotonic: false,
                expired_at: 'Fri, 14 Mar 2025 14:37:37 UTC',
                length: 0,
                bytes: 0,
            },
        ];

        const listDIDsEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dids/search`,
            method: 'GET',
            includes: 'test/dids/search',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: Readable.from(dids.map(did => JSON.stringify(did)).join('\n')),
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [listDIDsEndpoint]);

        const res = MockHttpStreamableResponseFactory.getMockResponse();
        const listDIDsController = appContainer.get<BaseController<ListExtendedDIDsControllerParameters, ListExtendedDIDsRequest>>(
            CONTROLLERS.LIST_EXTENDED_DIDS,
        );
        const controllerParams: ListExtendedDIDsControllerParameters = {
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            query: 'test:dataset1',
            type: 'dataset',
        };
        await listDIDsController.execute(controllerParams);

        const receivedData: string[] = await collectStreamedData(res);

        expect(receivedData.map(rawData => JSON.parse(rawData))).toEqual([
            {
                status: 'success',
                name: 'dataset1',
                scope: 'test',
                did_type: DIDType.DATASET,
                account: 'root',
                open: true,
                monotonic: false,
                expired_at: 'Fri, 14 Mar 2025 14:37:37 UTC',
                length: 0,
                bytes: 0,
                md5: null,
                adler32: null,
            },
            {
                status: 'success',
                name: 'dataset2',
                scope: 'test',
                did_type: DIDType.DATASET,
                account: 'root',
                open: true,
                monotonic: false,
                expired_at: 'Fri, 14 Mar 2025 14:37:37 UTC',
                length: 0,
                bytes: 0,
                md5: null,
                adler32: null,
            },
            {
                status: 'success',
                name: 'dataset3',
                scope: 'test',
                did_type: DIDType.DATASET,
                account: 'root',
                open: true,
                monotonic: false,
                expired_at: 'Fri, 14 Mar 2025 14:37:37 UTC',
                length: 0,
                bytes: 0,
                md5: null,
                adler32: null,
            },
        ]);
    });
});
