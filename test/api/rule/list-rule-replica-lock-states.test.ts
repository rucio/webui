import appContainer from '@/lib/infrastructure/ioc/container-config';
import { ListRulesRequest } from '@/lib/core/usecase-models/list-rules-usecase-models';
import { ListRulesControllerParameters } from '@/lib/infrastructure/controller/list-rules-controller';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';

import { NextApiResponse } from 'next';
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures';
import { Readable } from 'stream';
import MockRucioServerFactory, { MockEndpoint } from '../../fixtures/rucio-server';
import { BaseController } from '@/lib/sdk/controller';
import ListRuleReplicaLockStates from '@/pages/api/feature/list-rule-replica-lock-states';
import { ListRuleReplicaLockStatesRequest } from '@/lib/core/usecase-models/list-rule-replica-lock-states-usecase-models';
import { ListRuleReplicaLockStatesControllerParameters } from '@/lib/infrastructure/controller/list-rule-replica-lock-states-controller';

describe('Feature: ListRules', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const mockLock = {
            scope: 'test',
            name: 'file',
            rse_id: 'da739c56d6df4a199badc7b1cf53c13c',
            rse: 'MOCK',
            state: 'REPLICATING',
            rule_id: 'c0301e6bce06448e807503e608255130',
        };

        const listLocksMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rules/c0301e6bce06448e807503e608255130/locks`,
            method: 'GET',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: Readable.from([JSON.stringify(mockLock), JSON.stringify(mockLock)].join('\n')),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [listLocksMockEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    it('should return a view model for a valid request to ListRules feature', async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse();

        const listLocksController = appContainer.get<BaseController<ListRuleReplicaLockStatesControllerParameters, ListRuleReplicaLockStatesRequest>>(
            CONTROLLERS.LIST_RULE_REPLICA_LOCK_STATES,
        );
        const listRulesControllerParams: ListRuleReplicaLockStatesControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            id: 'c0301e6bce06448e807503e608255130',
            response: res as unknown as NextApiResponse,
        };

        await listLocksController.execute(listRulesControllerParams);

        const receivedData: any[] = [];
        const onData = (data: any) => {
            receivedData.push(JSON.parse(data));
        };

        // TODO: decompose
        const done = new Promise<void>((resolve, reject) => {
            res.on('data', onData);
            res.on('end', () => {
                res.off('data', onData);
                resolve();
            });
            res.on('error', err => {
                res.off('data', onData);
                reject(err);
            });
        });

        await done;
        expect(receivedData.length).toEqual(2);
        expect(receivedData[0].status).toEqual('success');
        expect(receivedData[0].name).toEqual('file');
        expect(receivedData[1].rse).toEqual('MOCK');
    });
});
