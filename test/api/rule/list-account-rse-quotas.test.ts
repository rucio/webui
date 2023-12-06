import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";
import { Readable } from "stream";
import { rses } from "test/fixtures/rse-fixtures";
import { ListAccountRSEQuotasControllerParameters } from "@/lib/infrastructure/controller/list-account-rse-quotas-controller";
import { MockHttpStreamableResponseFactory } from "test/fixtures/http-fixtures";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import { BaseController } from "@/lib/sdk/controller";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { ListAccountRSEQuotasRequest } from "@/lib/core/usecase-models/list-account-rse-quotas-usecase-models";
import { NextApiResponse } from "next";
import { DIDLong, DIDType } from "@/lib/core/entity/rucio";
import { collectStreamedData } from "@/lib/sdk/utils";
import { RSEAccountUsageLimitViewModel } from "@/lib/infrastructure/data/view-model/rse";


describe("Create Rule: List Account RSE Quotas", () => {

    beforeEach(() => {
        fetchMock.doMock();
        const accountInfoEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/mayank`,
            method: 'GET',
            endsWith: 'accounts/mayank',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "status": "ACTIVE",
                    "deleted_at": null,
                    "updated_at": "2023-11-27T17:54:04",
                    "email": null,
                    "account_type": "USER",
                    "suspended_at": null,
                    "account": "root",
                    "created_at": "2023-11-27T17:54:04"
                })
            }
        }

        const accountLimitEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/mayank/limits`,
            method: 'GET',
            endsWith: '/limits',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "XRD1": 200,
                    "XRD2": -1,
                    "XRD3": Infinity,
                    "XRD4": Infinity,
                    "SSH1": Infinity
                })
            }
        }

        const rseAccountUsageStream = Readable.from([
            JSON.stringify({ "rse_id": "72fb4137ba3c460090bbd3fd8d490f8b", "rse": "XRD1", "bytes": 500, "files": 8, "bytes_limit": Infinity, "bytes_remaining": Infinity }),
            JSON.stringify({ "rse_id": "d72884a3eb1747cf979af8959c978aab", "rse": "XRD2", "bytes": 100, "files": 2, "bytes_limit": 900, "bytes_remaining": 800 }),
            JSON.stringify({ "rse_id": "2bb03a45a1b64b459cdc445d9844d936", "rse": "XRD3", "bytes": 400, "files": 7, "bytes_limit": 600, "bytes_remaining": 200 }),
            JSON.stringify({ "rse_id": "5883a989c9c047d99d2fc1c074e40f58", "rse": "XRD4", "bytes": 300, "files": 6, "bytes_limit": 700, "bytes_remaining": 400 }),
            JSON.stringify({ "rse_id": "5464fa3806324211ac5b490ce77acbfc", "rse": "SSH1", "bytes": 200, "files": 3, "bytes_limit": 800, "bytes_remaining": 600 }),
        ].join('\n'))

        const listAccountRSEUsageEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/mayank/usage`,
            method: 'GET',
            includes: 'mayank/usage',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: rseAccountUsageStream
            }
        }
        const rseStream = Readable.from(
            [
                JSON.stringify(rses['XRD1']),
                JSON.stringify(rses['XRD2']),
                JSON.stringify(rses['XRD3']),
                JSON.stringify(rses['XRD4']),
                JSON.stringify(rses['SSH1']),
            ].join('\n')
        )
        const listRSEsEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/rses/`,
            method: 'GET',
            includes: 'rses/',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: rseStream,
            },
        }
        MockRucioServerFactory.createMockRucioServer(true, [accountInfoEndpoint, accountLimitEndpoint, listAccountRSEUsageEndpoint, listRSEsEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });
    
    it("should return a list of account RSE quotas", async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse()

        const controller = appContainer.get<BaseController<ListAccountRSEQuotasControllerParameters, ListAccountRSEQuotasRequest>>(CONTROLLERS.LIST_ACCOUNT_RSE_QUOTAS)
        const controllerParameters: ListAccountRSEQuotasControllerParameters = {
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            response: res as unknown as NextApiResponse,
            account: 'mayank',
            requestedDIDs: [
                {
                    scope: 'test',
                    name: 'container',
                    did_type: DIDType.CONTAINER,
                    bytes: 100,
                    length: 4
                } as DIDLong,
            ]
        }

        await controller.execute(controllerParameters)

        const recievedData: RSEAccountUsageLimitViewModel[] = await collectStreamedData<RSEAccountUsageLimitViewModel>(res)
        expect(recievedData.length).toEqual(5)
    });

});