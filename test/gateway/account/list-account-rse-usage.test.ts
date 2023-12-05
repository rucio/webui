import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";
import { Readable } from "stream";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway";
import AccountGatewayOutputPort from "@/lib/core/port/secondary/account-gateway-output-port";
import { AccountRSEUsageDTO, ListAccountRSEUsageDTO } from "@/lib/core/dto/account-dto";
import { collectStreamedData } from "test/fixtures/stream-test-utils";

describe('Account Gateway : List RSE Usage for an account', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const rseStream = Readable.from([
            JSON.stringify({"rse_id": "d72884a3eb1747cf979af8959c978aab", "rse": "XRD2", "bytes": 100, "files": 2, "bytes_limit": 900, "bytes_remaining": 800}),
            JSON.stringify({"rse_id": "5464fa3806324211ac5b490ce77acbfc", "rse": "SSH1", "bytes": 200, "files": 3, "bytes_limit": 800, "bytes_remaining": 600}),
            JSON.stringify({"rse_id": "5883a989c9c047d99d2fc1c074e40f58", "rse": "XRD4", "bytes": 300, "files": 6, "bytes_limit": 700, "bytes_remaining": 400}),
            JSON.stringify({"rse_id": "2bb03a45a1b64b459cdc445d9844d936", "rse": "XRD3", "bytes": 400, "files": 7, "bytes_limit": 600, "bytes_remaining": 200}),
            JSON.stringify({"rse_id": "72fb4137ba3c460090bbd3fd8d490f8b", "rse": "XRD1", "bytes": 500, "files": 8, "bytes_limit": Infinity, "bytes_remaining": Infinity}),
        ].join('\n'))

        const listAccountRSEUsageEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/accounts/root/usage`,
            method: 'GET',
            includes: 'usage',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: rseStream
            }
        }

        MockRucioServerFactory.createMockRucioServer(true, [listAccountRSEUsageEndpoint]);
    })

    afterEach(() => {
        fetchMock.dontMock();
    })

    it('Should fetch a list of RSE Usage for a given account', async () => {
        const accountGateway: AccountGatewayOutputPort = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT)
        const listAcountRSEUsageDTO: ListAccountRSEUsageDTO = await accountGateway.listAccountRSEUsage('root', MockRucioServerFactory.VALID_RUCIO_TOKEN)
        expect(listAcountRSEUsageDTO.status).toEqual('success')

        const accountRSEUsageStream  =  listAcountRSEUsageDTO.stream
        if( accountRSEUsageStream == null || accountRSEUsageStream == undefined) {
            fail('Account RSE Usage stream is null or undefined')
        }

        const recievedData: AccountRSEUsageDTO[] = await collectStreamedData<AccountRSEUsageDTO>(accountRSEUsageStream)
        expect(recievedData.length).toEqual(5)
        expect(recievedData[0].rse_id).toEqual('d72884a3eb1747cf979af8959c978aab')
        expect(recievedData[0].rse).toEqual('XRD2')
        expect(recievedData[0].used_bytes).toEqual(100)
        expect(recievedData[0].files).toEqual(2)
        expect(recievedData[0].quota_bytes).toEqual(900)
    })
});