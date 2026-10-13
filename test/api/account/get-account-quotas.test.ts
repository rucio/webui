import { Readable } from 'stream';
import { GetAccountQuotasRequest } from '@/lib/core/usecase-models/get-account-quotas-usecase-models';
import { GetAccountQuotasControllerParameters } from '@/lib/infrastructure/controller/get-account-quotas-controller';
import { AccountQuotasViewModel } from '@/lib/infrastructure/data/view-model/account';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiResponse } from 'next';
import { createHttpMocks } from 'test/fixtures/http-fixtures';
import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';

const base = `${MockRucioServerFactory.RUCIO_HOST}/accounts/jdoe`;
const ok = (url: string, body: string | Readable, contentType = 'application/json'): MockEndpoint => ({
    url,
    method: 'GET',
    response: { status: 200, headers: { 'Content-Type': contentType }, body },
});

describe('Feature: GetAccountQuotas', () => {
    beforeEach(() => {
        fetchMock.doMock();
    });

    afterEach(() => {
        fetchMock.dontMock();
    });

    const run = async () => {
        const { res } = await createHttpMocks('/api/feature/get-account-quotas?account=jdoe', 'GET', {});
        const controller = appContainer.get<BaseController<GetAccountQuotasControllerParameters, GetAccountQuotasRequest>>(
            CONTROLLERS.GET_ACCOUNT_QUOTAS,
        );
        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            account: 'jdoe',
        });
        return res;
    };

    const endpoints = (): MockEndpoint[] => [
        ok(`${base}/limits`, JSON.stringify({ XRD1: 100, XRD2: -1 })),
        ok(
            `${base}/usage`,
            Readable.from([JSON.stringify({ rse_id: 'id1', rse: 'XRD1', bytes: 20, files: 1, bytes_limit: 100, bytes_remaining: 80 })].join('\n')),
        ),
        ok(`${base}/limits/global`, JSON.stringify({ 'tier=1': { resolved_rses: ['A', 'B'], resolved_rse_ids: ['1', '2'], limit: 10 } })),
        ok(
            `${base}/usage/global`,
            [JSON.stringify({ rse_expression: 'tier=1', bytes: 4, files: 2, bytes_limit: 10, bytes_remaining: 6 })].join('\n'),
            'application/x-json-stream',
        ),
    ];

    it('returns the merged local and global quotas', async () => {
        MockRucioServerFactory.createMockRucioServer(true, endpoints());
        const res = await run();

        expect(res._getStatusCode()).toBe(200);
        const data: AccountQuotasViewModel = await res._getJSONData();
        expect(data.status).toBe('success');
        expect(data.local).toEqual([
            { rse: 'XRD1', rseId: 'id1', bytesLimit: 100, bytesUsed: 20, files: 1, bytesRemaining: 80 },
            { rse: 'XRD2', bytesLimit: -1, bytesUsed: 0, files: 0, bytesRemaining: null },
        ]);
        expect(data.global).toEqual([
            { rseExpression: 'tier=1', resolvedRses: ['A', 'B'], bytesLimit: 10, bytesUsed: 4, files: 2, bytesRemaining: 6 },
        ]);
    });

    it.each([
        [404, undefined, 'not_found'],
        [401, 'AccessDenied', 'permission_denied'],
    ])('maps a failing global limits call with status %s (%s) to errorType %s', async (status, exceptionClass, errorType) => {
        const failing: MockEndpoint = {
            url: `${base}/limits/global`,
            method: 'GET',
            response: {
                status,
                headers: { 'Content-Type': 'application/json', ...(exceptionClass ? { ExceptionClass: exceptionClass } : {}) },
                body: JSON.stringify({ ExceptionMessage: 'nope', ...(exceptionClass ? { ExceptionClass: exceptionClass } : {}) }),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [failing, ...endpoints()]);
        const res = await run();

        expect(res._getStatusCode()).toBe(status);
        const data: AccountQuotasViewModel = await res._getJSONData();
        expect(data.status).toBe('error');
        expect(data.errorType).toBe(errorType);
        expect(data.local).toEqual([]);
        expect(data.global).toEqual([]);
    });
});
