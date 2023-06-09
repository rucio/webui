import { HTTPRequest } from '@/lib/common/stream/http'
import { Headers } from 'node-fetch'
import { Readable } from 'stream'

export interface Endpoint extends HTTPRequest {
    endsWith?: string | null
    includes?: string | null
    response: GatewayResponse
}

export type GatewayResponse = {
    status: number,
    headers: Headers | { [key: string]: string } | null,
    body: string | Readable | null

}
export default class MockRucioServerFactory {
    static VALID_RUCIO_TOKEN: string = 'rucio-ddmlab-askdjljioj'
    static RUCIO_HOST: string = 'https://rucio-host.com'

    static createMockRucioServer(checkAuth: boolean = true, endpoints: Endpoint[]) {
        fetchMock.mockIf(/^https?:\/\/rucio-host.com.*$/, req => {
            if (checkAuth) {
                const rucioToken = req.headers.get('X-Rucio-Auth-Token')
                if (rucioToken !== MockRucioServerFactory.VALID_RUCIO_TOKEN) {
                    return Promise.resolve({
                        status: 401,
                    })
                }
            }
            const endpoint = endpoints.find(endpoint => {
                if(endpoint.url === req.url && endpoint.method === req.method) {
                    return true
                }
                if(endpoint.endsWith && req.url.endsWith(endpoint.endsWith) && endpoint.method === req.method) {
                    return true
                }
                if(endpoint.includes && req.url.includes(endpoint.includes) && endpoint.method === req.method) {
                    return true
                }
                return false
            })
            if(!endpoint) {
                return Promise.resolve({
                    status: 404,
                    body: JSON.stringify('Not found')
                } as GatewayResponse)
            }
            return Promise.resolve(endpoint.response)
        })
    }
}
          