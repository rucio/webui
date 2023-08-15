import { DIDMetaDTO } from "@/lib/core/dto/did-dto";
import DIDGatewayOutputPort from "@/lib/core/port/secondary/did-gateway-output-port";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway";
import MockRucioServerFactory, { MockEndpoint } from "../../fixtures/rucio-server";

describe("DID Gateway Meta Endpoint Tests", () => {
    beforeEach(() => {
        fetchMock.doMock();
        const didMetaMMockEndpoint: MockEndpoint = {
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
                    "account": "root",
                    "did_type": "DATASET",
                    "is_open": true,
                    "monotonic": false,
                    "hidden": false,
                    "obsolete": false,
                    "complete": null,
                    "is_new": true,
                    "availability": "AVAILABLE",
                    "suppressed": false,
                    "bytes": null,
                    "length": null,
                    "md5": null,
                    "adler32": null,
                    "expired_at": null,
                    "purge_replicas": true,
                    "deleted_at": null,
                    "events": null,
                    "guid": null,
                    "project": null,
                    "datatype": null,
                    "run_number": null,
                    "stream_name": null,
                    "prod_step": null,
                    "version": null,
                    "campaign": null,
                    "task_id": null,
                    "panda_id": null,
                    "lumiblocknr": null,
                    "provenance": null,
                    "phys_group": null,
                    "transient": false,
                    "accessed_at": null,
                    "closed_at": null,
                    "eol_at": null,
                    "is_archive": null,
                    "constituent": null,
                    "access_cnt": null,
                    "created_at": "Mon, 10 Jul 2023 13:23:56 UTC",
                    "updated_at": "Mon, 10 Jul 2023 13:23:56 UTC"
                })
            }
        }
        MockRucioServerFactory.createMockRucioServer(true, [didMetaMMockEndpoint]);
    });
    afterEach(() => {
        fetchMock.dontMock();
    });

    it("Should return a DIDMetaDTO", async () => {
        const didGateway: DIDGatewayOutputPort = appContainer.get(GATEWAYS.DID);
        const dto: DIDMetaDTO = await didGateway.getDIDMeta(MockRucioServerFactory.VALID_RUCIO_TOKEN, "test", "dataset1");
        expect(dto.status).toEqual("success")
        expect(dto.name).toEqual("dataset1")
        expect(dto.scope).toEqual("test")
        expect(dto.created_at).toEqual("Mon, 10 Jul 2023 13:23:56 UTC")
    })
    
    it("Should return an Auth Error", async() => {
        const didGateway: DIDGatewayOutputPort = appContainer.get(GATEWAYS.DID);
        const dto: DIDMetaDTO = await didGateway.getDIDMeta("gfhfgsjiyug", "test", "dataset1");
        expect(dto.status).toEqual("error")
        expect(dto.errorName).toEqual("Invalid Auth Token")
        expect(dto.errorMessage).toEqual("The provided authentication token is invalid or has expired. ")
    })
});