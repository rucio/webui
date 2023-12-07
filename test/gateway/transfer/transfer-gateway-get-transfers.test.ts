import { ListTransfersDTO, TransferDTO } from "@/lib/core/dto/transfer-dto";
import TransferGatewayOutputPort from "@/lib/core/port/secondary/transfer-gateway-output-port";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway";
import { Readable } from "stream";
import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";
import { collectStreamedData } from "test/fixtures/stream-test-utils";

describe('TransferGateway', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const transferStream = Readable.from([
            JSON.stringify({
                id: 'dummy_transfer_1',
                request_type: 'T',
                scope: 'test',
                name: 'file1',
                did_type: 'File',
                attributes: '',
                retry_count: 0,
                rule_id: 'rule1',
                bytes: 500000,
                activity: 'Rebalance',
                state: 'S',
                source_rse_id: '59fcad356a68434cbe8c43737ccb3f83',
                dest_rse_id: '328c926f09ea4dc0a5ddfbe62c8e3bd5',
                source_rse: 'SWIFT',
                dest_rse: 'AMAZON-BOTO',
                transfertool: 'fts',
                priority: 10,
                account: 'root',
                requested_at: 'Sat, 11 Nov 2023 06:00:00 UTC',
                submitted_at: 'Sat, 11 Nov 2023 06:00:10 UTC',
                started_at: 'Sat, 11 Nov 2023 06:00:15 UTC',
                transferred_at: null,
            }),
            JSON.stringify({
                id: 'dummy_transfer_2',
                request_type: 'T',
                scope: 'test',
                name: 'file2',
                did_type: 'File',
                attributes: '',
                retry_count: 0,
                rule_id: 'rule1',
                bytes: 500000,
                activity: 'Rebalance',
                state: 'S',
                source_rse_id: '59fcad356a68434cbe8c43737ccb3f83',
                dest_rse_id: '328c926f09ea4dc0a5ddfbe62c8e3bd5',
                source_rse: 'SWIFT',
                dest_rse: 'AMAZON-BOTO',
                transfertool: 'fts',
                priority: 10,
                account: 'root',
                requested_at: 'Sat, 11 Nov 2023 06:00:01 UTC',
                submitted_at: 'Sat, 11 Nov 2023 06:00:10 UTC',
                started_at: 'Sat, 11 Nov 2023 06:00:15 UTC',
                transferred_at: null,
            }),
            JSON.stringify({
                id: 'dummy_transfer_3',
                request_type: 'T',
                scope: 'test',
                name: 'file3',
                did_type: 'File',
                attributes: '',
                retry_count: 0,
                rule_id: 'rule1',
                bytes: 1000000,
                activity: 'Rebalance',
                state: 'S',
                source_rse_id: '59fcad356a68434cbe8c43737ccb3f83',
                dest_rse_id: '328c926f09ea4dc0a5ddfbe62c8e3bd5',
                source_rse: 'SWIFT',
                dest_rse: 'AMAZON-BOTO',
                transfertool: 'fts',
                priority: 10,
                account: 'root',
                requested_at: 'Sat, 11 Nov 2023 06:00:02 UTC',
                submitted_at: 'Sat, 11 Nov 2023 06:00:10 UTC',
                started_at: 'Sat, 11 Nov 2023 06:00:15 UTC',
                transferred_at: null,
            }),
        ].join('\n'))

        const listTransfersEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/requests/list?src_rse=SWIFT&dest_rse=AMAZON-BOTO`,
            method: 'GET',
            includes: 'requests/list?src_rse=SWIFT&dest_rse=AMAZON-BOTO',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: transferStream,
            },
        }

        MockRucioServerFactory.createMockRucioServer(true, [listTransfersEndpoint])
    })
    afterEach(() => {
        fetchMock.dontMock();
    })
    it('Should fetch a list of Transfers', async () => {
        const TransferGateway: TransferGatewayOutputPort = appContainer.get<TransferGatewayOutputPort>(GATEWAYS.TRANSFER)
        const listTransfersDTO: ListTransfersDTO = await TransferGateway.listTransfers( MockRucioServerFactory.VALID_RUCIO_TOKEN, 'SWIFT', 'AMAZON-BOTO' )
        expect(listTransfersDTO.status).toEqual('success')

        const transferStream = listTransfersDTO.stream
        if (transferStream == null || transferStream == undefined) {
            fail('Transfer stream is null or undefined')
        }

        const receivedData: TransferDTO[] = await collectStreamedData<TransferDTO>(transferStream)
        expect(receivedData.length).toEqual(3)
        receivedData.forEach((d) => {
            expect(d.source_rse).toEqual('SWIFT')
            expect(d.dest_rse).toEqual('AMAZON-BOTO')
        })
    })
})