import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";
import { Readable } from "stream";
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway";
import DIDGatewayOutputPort from "@/lib/core/port/secondary/did-gateway-output-port";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import { DIDRulesDTO, ListDIDRulesDTO } from "@/lib/core/dto/did-dto";
import { RuleState } from "@/lib/core/entity/rucio";

describe("DID Gateway List DID Parent Endpoint Tests", () => {
    beforeEach(() => {
        fetchMock.doMock();
        const didListRulesMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/file1/parents`,
            method: "GET",
            includes: "test/dataset1/rules",
            response: {
                status: 200,
                headers: {
                    "Content-Type": "application/x-json-stream",
                },
                body: Readable.from( [
                    JSON.stringify({
                        "scope": "test",
                        "name": "dataset1",
                        "type": "DATASET"
                    }),
                    JSON.stringify({
                        "scope": "test",
                        "name": "dataset2",
                        "type": "DATASET"
                    })
                ].join("\n")),
            },
        };

        MockRucioServerFactory.createMockRucioServer(true, [didListRulesMockEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });
    it('should successfully stream a list of rules for a DID', async () => {
        
        const rucioDIDGateway: DIDGatewayOutputPort = appContainer.get<DIDGatewayOutputPort>(GATEWAYS.DID)
        const dto: ListDIDRulesDTO = await rucioDIDGateway.listDIDParents(MockRucioServerFactory.VALID_RUCIO_TOKEN, "test", "file1");
        expect(dto.status).toBe('success');
        
        const didParentsStream = dto.stream;
        expect(didParentsStream).toBeDefined();

        if( didParentsStream == null || didParentsStream == undefined) {
            fail('didParentsStream is null or undefined');
        }

        const receivedData: any[] = []
        const onData = (data: DIDRulesDTO) => {
            receivedData.push(data)
        }

        await new Promise((resolve, reject) => {
            didParentsStream.on('data', onData)
            didParentsStream.on('end', resolve)
            didParentsStream.on('error', reject)
        });

        expect(receivedData.length).toBe(2);
        expect(receivedData).toEqual([
            {
                "scope": "test",
                "name": "dataset1",
                "type": "DATASET"
            },
            {
                "scope": "test",
                "name": "dataset2",
                "type": "DATASET"
            }
        ])
    });
});