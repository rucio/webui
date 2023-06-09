import appContainer from "@/lib/infrastructure/config/ioc/container-config"
import CONTROLLERS from "@/lib/infrastructure/config/ioc/ioc-symbols-controllers"
import { IListDIDsController } from "@/lib/infrastructure/controller/list-dids-controller"
import { NextApiResponse } from "next"
import { createRequest, createResponse, ResponseOptions } from "node-mocks-http"
import { Readable } from "stream"
import { EventEmitter, PassThrough } from "stream"
import { ServerResponse } from "http"

describe('DID API Tests', () => {
    beforeEach(() => {
        fetchMock.doMock()
        fetchMock.mockIf(/^https?:\/\/rucio-host.com.*$/, req => {
            const rucioToken = req.headers.get('X-Rucio-Auth-Token')
            if (rucioToken !== 'rucio-ddmlab-askdjljioj') {
                return Promise.resolve({
                    status: 401,
                })
            }
            if (req.url.includes('/test/dids/search')) {
                const stream = Readable.from(
                    [
                        'data17_13TeV.00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_00',
                        'data17_13TeV.00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_01',
                        'data17_13TeV.00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_02',
                    ].join('\n'),
                )
                return Promise.resolve({
                    status: 200,
                    headers: {
                        'Content-Type': 'application/x-json-stream',
                    },
                    body: stream,
                })
            }
            if (req.url.endsWith('/test/dataset1/status')){
                return Promise.resolve({
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "scope": "test",
                        "name": "dataset1",
                        "type": "DATASET",
                        "account": "root",
                        "open": true,
                        "monotonic": false,
                        "expired_at": null,
                        "length": null,
                        "bytes": null
                    })
                })
            }
        })
    })
    afterEach(() => {
        fetchMock.dontMock()
    })

    it("Should successfully stream DIDs", async () => {
        const res = createResponse({
            eventEmitter: EventEmitter,
        })
        const listDIDsController = appContainer.get<IListDIDsController>(CONTROLLERS.LIST_DIDS)
        await listDIDsController.listDIDs(res as unknown as NextApiResponse, 'rucio-ddmlab-askdjljioj', 'test:dataset1', 'all')

        const receivedData: string[] = []
        const onData = (data: any) => {
            receivedData.push(JSON.parse(data.toString()))
        }
       
        const done = new Promise<void>((resolve, reject) => {
            res.on('data', onData)
            res.on('end', () => {
                console.log('end')
                res.off('data', onData)
                resolve()
            })
            res.on('error', err => {
                res.off('data', onData)
                reject(err)
            })
        })

        await done;
        expect(receivedData).toEqual([
            "data17_13TeV.00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_00",
            "data17_13TeV.00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_01",
            "data17_13TeV.00325748.physics_Main.merge.DAOD_EXOT15.f102_m2608_p3372_tid15339900_02"
        ])

        
    })

    it('should do something', async function() {
        const req = createRequest();
        const res = createResponse({
            eventEmitter: require('events').EventEmitter
          });

        const recordedData: any[] = [];
        const done = Promise.resolve(res.on('end', async function() {
          const data = await res._getData();
        //   expect(data).to.equal('data sent in request');
            recordedData.push(data);
        }));
    
        route(req,res);
    
        req.send('data sent in request');
        await done;
        expect(recordedData).toEqual(['data sent in request']);
      });
    
      function route(req: any,res: any){
        let data: string[] = [];
        req.on("data", (chunk: any) => {
            data.push(chunk.toString());
        });
        req.on("end", () => {
            const output = data.join("");
            res.write(output);
            res.end();
        });
        
    }

})