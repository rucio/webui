import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";
import { Readable } from "stream";
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway";
import DIDGatewayOutputPort from "@/lib/core/port/secondary/did-gateway-output-port";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import { DIDRulesDTO, ListDIDRulesDTO as ListDIDDTO } from "@/lib/core/dto/did-dto";
import { DIDType, RuleState } from "@/lib/core/entity/rucio";

describe("DID Gateway List DID Contents Endpoint Tests", () => {
    beforeEach(() => {
        fetchMock.doMock();
        const didListContentsMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/replicas/list`,
            method: 'POST',
            includes: 'replicas/list',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: Readable.from(
                    [
                        JSON.stringify({
                            "scope": "test",
                            "name": "file1",
                            "rses": {
                              "XRD3": [
                                "root://xrd3:1096//rucio/test/80/25/file1"
                              ],
                              "XRD1": [
                                "root://xrd1:1094//rucio/test/80/25/file1"
                              ]
                            },
                            "states": {
                              "XRD3": "COPYING",
                              "XRD1": "AVAILABLE"
                            }
                        }),
                        
                        JSON.stringify({
                            "scope": "test",
                            "name": "file2",
                            "rses": {
                                "XRD3": [
                                    "root://xrd3:1096//rucio/test/80/25/file2"
                                ],
                                "XRD1": [
                                    "root://xrd1:1094//rucio/test/80/25/file2"
                                ]
                            },
                            "states": {
                                "XRD3": "AVAILABLE",
                                "XRD1": "AVAILABLE"
                            }
                        }),
                    ].join('\n')
                )
            }
        }

        MockRucioServerFactory.createMockRucioServer(true, [didListContentsMockEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });
    it('should successfully stream a list of files for a Dataset DID', async () => {
        
        const rucioDIDGateway: DIDGatewayOutputPort = appContainer.get<DIDGatewayOutputPort>(GATEWAYS.DID)
        const dto: ListDIDDTO = await rucioDIDGateway.listDIDContents(MockRucioServerFactory.VALID_RUCIO_TOKEN, "test", "file1");
        expect(dto.status).toBe('success');
        
        const didContentsStream = dto.stream;
        expect(didContentsStream).toBeDefined();

        if( didContentsStream == null || didContentsStream == undefined) {
            fail('didContentsStream is null or undefined');
        }

        const receivedData: any[] = []
        const onData = (data: DIDRulesDTO) => {
            receivedData.push(data)
        }

        await new Promise((resolve, reject) => {
            didContentsStream.on('data', onData)
            didContentsStream.on('end', resolve)
            didContentsStream.on('error', reject)
        });

        expect(receivedData.length).toBe(2);
        expect(receivedData).toEqual([
            {
                "status": "success",
                "scope": "test",
                "name": "file1",
                "did_type": DIDType.FILE,
            },
            {
                "status": "success",
                "scope": "test",
                "name": "file2",
                "did_type": DIDType.FILE,
            }
        ])
    });
});