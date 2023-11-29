import { AccountInfoDTO } from "@/lib/core/dto/account-dto";
import { AccountStatus, AccountType } from "@/lib/core/entity/rucio";
import AccountGatewayOutputPort from "@/lib/core/port/secondary/account-gateway-output-port";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway";
import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";

describe("Account Gateway: Get Account Info", () => {
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
    })

    afterEach(() => {
        fetchMock.dontMock();
    })

    it("Should fetch account info for a given account", async () => {
        const accountGateway: AccountGatewayOutputPort = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT)
        const accountInfoDTO: AccountInfoDTO = await accountGateway.getAccountInfo('root', MockRucioServerFactory.VALID_RUCIO_TOKEN)
        expect(accountInfoDTO.status).toEqual('success')
        expect(accountInfoDTO.account).toEqual('root')
        expect(accountInfoDTO.accountType).toEqual(AccountType.SERVICE)
        expect(accountInfoDTO.email).toEqual("")
        expect(accountInfoDTO.accountStatus).toEqual(AccountStatus.ACTIVE)
        expect(accountInfoDTO.deletedAt).toEqual(undefined)
        expect(accountInfoDTO.suspendedAt).toEqual(undefined)
        expect(accountInfoDTO.createdAt).toEqual('2023-11-27T17:54:04')
        expect(accountInfoDTO.updatedAt).toEqual('2023-11-27T17:54:04')

    })
})