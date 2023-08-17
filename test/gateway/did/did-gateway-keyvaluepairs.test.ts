import { DIDKeyValuePairsDTO } from "@/lib/core/dto/did-dto";
import DIDGatewayOutputPort from "@/lib/core/port/secondary/did-gateway-output-port";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway";
import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";

describe("DID Gateway KeyValuePairs Endpoint Tests", () => {
    beforeEach(() => {
        fetchMock.doMock();
        const didKVMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dataset1/meta`,
            method: "GET",
            includes: "test/dataset1/meta",
            response: {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "scope": "test",
                    "name": "dataset1",
                    "extra_key": "extra_value",
                })
            }
        }
        MockRucioServerFactory.createMockRucioServer(true, [didKVMockEndpoint]);
    });
    afterEach(() => {
        fetchMock.dontMock();
    });
    it("should return a DIDKeyValuePairsDTO", async () => {
        const didGateway: DIDGatewayOutputPort = appContainer.get(GATEWAYS.DID)
        const dto: DIDKeyValuePairsDTO = await didGateway.getDIDKeyValuePairs(MockRucioServerFactory.VALID_RUCIO_TOKEN, "test", "dataset1")
        expect(dto.status).toEqual("success")
        expect(dto.data).toContainEqual({key: "extra_key", value: "extra_value"})
    });
})
