import { AccountType } from "@/lib/core/entity/rucio";
import { GetAccountInfoRequest } from "@/lib/core/usecase-models/get-account-info-usecase-models";
import { GetAccountInfoControllerParameters } from "@/lib/infrastructure/controller/get-account-info-controller";
import { AccountInfoViewModel } from "@/lib/infrastructure/data/view-model/account";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiResponse } from "next";
import { createHttpMocks } from "test/fixtures/http-fixtures";
import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";

describe("Get Account Info", () => {
    beforeEach(() => {
        fetchMock.doMock();
        const accountInfoEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/root`,
            method: 'GET',
            includes: 'account',
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
                    "account_type": "SERVICE",
                    "suspended_at": null,
                    "account": "root",
                    "created_at": "2023-11-27T17:54:04"
                })
            }
        }
        MockRucioServerFactory.createMockRucioServer(true, [accountInfoEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });
    
    it("should return a view model for a valid request to GetAccountInfo feature", async () => {
        const { req, res, session } = await createHttpMocks('/api/did-meta', 'GET', {})
        
        const controller = appContainer.get<BaseController<GetAccountInfoControllerParameters, GetAccountInfoRequest>>(CONTROLLERS.GET_ACCOUNT_INFO)
        const controllerParameters: GetAccountInfoControllerParameters = {
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            account: 'root'
        }

        await controller.execute(controllerParameters)
        expect(res._getStatusCode()).toBe(200)
        const data: AccountInfoViewModel = await res._getJSONData()
        expect(data.status).toBe('success')

        expect(data.accountType).toBe(AccountType.SERVICE)

    });
});