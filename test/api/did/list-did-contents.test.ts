import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiResponse } from "next";
import { MockHttpStreamableResponseFactory } from "test/fixtures/http-fixtures";
import MockRucioServerFactory, { MockEndpoint } from "test/fixtures/rucio-server";
import { Readable } from "stream";
import { DIDType } from "@/lib/core/entity/rucio";
import { ListDIDContentsControllerParameters } from "@/lib/infrastructure/controller/list-did-contents-controller";
import { ListDIDContentsRequest } from "@/lib/core/usecase-models/list-did-contents-usecase-models";

describe("List DID Contents Feature tests", () => {
    beforeEach(() => {
        fetchMock.doMock();
        const didListContentsMockEndpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/dids/test/dataset1/dids`,
            method: 'GET',
            includes: '/dataset1/dids',
            response: {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-json-stream',
                },
                body: Readable.from(
                    [
                        JSON.stringify({"scope": "test", "name": "file1", "type": "FILE", "bytes": 10485760, "adler32": "517daa38", "md5": "e4319066a5d3771954652a6905cebe82"}),
                        JSON.stringify({"scope": "test", "name": "file2", "type": "FILE", "bytes": 10485760, "adler32": "fc6ff847", "md5": "bcc3619205bf64d3cbe984b27c042a01"}),
                    ].join('\n')
                )
            }
        }

        MockRucioServerFactory.createMockRucioServer(true, [didListContentsMockEndpoint]);
    });

    afterEach(() => {
        fetchMock.dontMock();
    });
    it("should list DID contents", async () => {
        const res = MockHttpStreamableResponseFactory.getMockResponse();

        const listDIDContentsController = appContainer.get<BaseController<ListDIDContentsControllerParameters, ListDIDContentsRequest>>(CONTROLLERS.LIST_DID_CONTENTS);
        const listDIDContentsControllerParams: ListDIDContentsControllerParameters = {
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            name: 'dataset1',
            scope: 'test'
        }

        await listDIDContentsController.execute(listDIDContentsControllerParams);

        const receivedData: any[] = []
        const onData = (data: any) => {
            receivedData.push(JSON.parse(data))
        }

        const done = new Promise<void>((resolve, reject) => {
            res.on('data', onData)
            res.on('end', () => {
                res.off('data', onData)
                resolve()
            })
            res.on('error', err => {
                res.off('data', onData)
                reject(err)
            })
        })

        await done
        console.log(receivedData)
        expect(receivedData.length).toBe(2)
        expect(receivedData[0]).toEqual({
            "status": "success",
            "scope": "test",
            "name": "file1",
            "did_type": DIDType.FILE
        })
        expect(receivedData[1]).toEqual({
            "status": "success",
            "scope": "test",
            "name": "file2",
            "did_type": DIDType.FILE
        })
        
    });
});