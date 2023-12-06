import { AccountRSELimitDTO, AccountRSEUsageDTO } from "@/lib/core/dto/account-dto";
import AccountGatewayOutputPort from "@/lib/core/port/secondary/account-gateway-output-port";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway";
import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";

describe("Account Gateway: Get Account Limits", () => {

    beforeEach(() => {
        fetchMock.doMock();
        const accountLimitEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/root/limits`,
            method: 'GET',
            includes: 'account',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "XRD1": -1,
                    "XRD2": 900,
                    "XRD3": 600,
                    "XRD4": 700,
                    "SSH1": 800
                })
            }
        }
        MockRucioServerFactory.createMockRucioServer(true, [accountLimitEndpoint]);
    })

    afterEach(() => {
        fetchMock.dontMock();
    })

    it("Should fetch account limits for a given account", async () => {
        const accountGateway: AccountGatewayOutputPort = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT)
        const accountRSEUsageDTO: AccountRSELimitDTO = await accountGateway.getAccountRSELimits('root', MockRucioServerFactory.VALID_RUCIO_TOKEN)
        expect(accountRSEUsageDTO.status).toEqual('success')
        expect(accountRSEUsageDTO.account).toEqual('root')
        expect(accountRSEUsageDTO.limits).toEqual({
            "XRD1": 200,
            "XRD2": Infinity,
            "XRD3": Infinity,
            "XRD4": Infinity,
            "SSH1": Infinity
        })
    })
});