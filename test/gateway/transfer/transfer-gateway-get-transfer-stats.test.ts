import { ListTransferStatisticsDTO, TransferStatisticsDTO } from "@/lib/core/dto/transfer-dto";
import { Readable } from "stream";
import TransferGatewayOutputPort from "@/lib/core/port/secondary/transfer-gateway-output-port";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway";
import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";
import { collectStreamedData } from "test/fixtures/stream-test-utils";

describe('TransferGateway Get Transfer Statistics', () => {
    beforeEach(() => {
        fetchMock.doMock();

        const transferStatsStream = Readable.from([
            JSON.stringify({
                source_rse_id: '59fcad356a68434cbe8c43737ccb3f83',
                dest_rse_id: '328c926f09ea4dc0a5ddfbe62c8e3bd5',
                activity: 'Rebalance',
                state: 'S',
                source_rse: 'SWIFT',
                dest_rse: 'AMAZON-BOTO',
                account: 'root',
                counter: 3,
                bytes: 2000000,
            })
        ].join('\n'))

        const listTransferStatsEndpoint: MockEndpoint =  {
            url: `${MockRucioServerFactory.RUCIO_HOST}/requests/metrics`,
            method: 'GET',
            includes: 'requests/metrics',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: transferStatsStream,
            },
        }

        MockRucioServerFactory.createMockRucioServer(true, [listTransferStatsEndpoint])
    })
    afterEach(() => {
        fetchMock.dontMock();
    })
    it('should fetch the list of transfer statistics', async () => {
        const transferGateway: TransferGatewayOutputPort = appContainer.get<TransferGatewayOutputPort>(GATEWAYS.TRANSFER)
        const listTransferStatisticsDTO: ListTransferStatisticsDTO = await transferGateway.listTransferStatistics( MockRucioServerFactory.VALID_RUCIO_TOKEN )
        expect(listTransferStatisticsDTO.status).toEqual('success')

        const tsStream = listTransferStatisticsDTO.stream
        if ( tsStream == null || tsStream == undefined ) {
            fail('Transfer Statistics stream is null or undefined')
        }

        const receivedData: TransferStatisticsDTO[] = await collectStreamedData<TransferStatisticsDTO>(tsStream)
        expect(receivedData.length).toEqual(1)
        expect(receivedData[0].state).toEqual('S')
    })
})