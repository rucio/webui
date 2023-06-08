import { HTTPRequest } from '@/lib/common/stream/http'
import { Response } from 'node-fetch'
import { DIDDTO, ListDIDDTO } from '@/lib/core/data/dto/did-dto'
import { DIDType } from '@/lib/core/entity/rucio'
import DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port'
import type EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port'
import type StreamGatewayOutputPort from '@/lib/core/port/secondary/stream-gateway-output-port'
import { inject, injectable } from 'inversify'
import GATEWAYS from '../config/ioc/ioc-symbols-gateway'
import { PassThrough } from 'node:stream'

@injectable()
export default class RucioDIDGateway implements DIDGatewayOutputPort {
    constructor(
        @inject(GATEWAYS.ENV_CONFIG)
        private envConfigGateway: EnvConfigGatewayOutputPort,
        @inject(GATEWAYS.STREAM)
        private streamingGateway: StreamGatewayOutputPort,
    ) {
        this.envConfigGateway = envConfigGateway
    }

    async listDIDs(
        rucioAuthToken: string,
        scope: string,
        name: string,
        type: DIDType,
    ): Promise<ListDIDDTO> {
        const rucioHost = await this.envConfigGateway.rucioHost()
        const endpoint = `${rucioHost}/dids/${scope}/dids/search`
        const request: HTTPRequest = {
            method: 'GET',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': rucioAuthToken,
                'Content-Type': 'application/x-json-stream',
            },
            body: null,
            params: {
                "name": name,
                "type": type.toLocaleLowerCase(),
            }
        }
        const response = await this.streamingGateway.getJSONChunks(request, true)
        if (response instanceof Response) {
            const errorCode = response.status
            const dto: ListDIDDTO = {
                status: 'error',
                error: 'Unknown Error',
                stream: null,
            }
            switch (errorCode) {
                case 401:
                    dto.error = 'Invalid Auth Token'
                    break
                case 404:
                    dto.error = 'Invalid key in filter'
                    break
                case 406:
                    dto.error = 'Not acceptable'
                    break
                case 409:
                    dto.error = 'Wrong did type'
                    break
                default:
                    dto.error = 'Unknown Error'
                    break
            }
        } else if (response instanceof PassThrough) {
            const dto: ListDIDDTO = {
                status: 'success',
                error: undefined,
                stream: response,
            }
            return dto
        }
        const dto: ListDIDDTO = {
            status: 'error',
            error: 'Unknown Error',
            stream: null,
        }
        return dto
    }

    async getDID(rucioAuthToken: string, scope: string, name: string): Promise<DIDDTO> {
        const rucioHost = await this.envConfigGateway.rucioHost()
        const endpoint = `${rucioHost}/dids/${scope}/${name}/status`
        const request: HTTPRequest = {
            method: 'GET',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': rucioAuthToken,
                'Content-Type': 'application/json',
            },
            body: null,
        }
        const response = await fetch(endpoint,  {
            method: request.method,
            headers: {
                'X-Rucio-Auth-Token': rucioAuthToken,
                'Content-Type': 'application/json',
            },
        })

        if (response.status === 200) {
            const data = await response.json()
            const type = data.type
            let did_type: DIDType = DIDType.UNKNOWN
            if (type === 'DATASET') {
                did_type = DIDType.DATASET
            } else if (type === 'CONTAINER') {
                did_type = DIDType.CONTAINER
            } else if (type === 'FILE') {
                did_type = DIDType.FILE
            }

            const dto: DIDDTO = {
                status: 'success',
                error: null,
                name: name,
                scope: scope,
                did_type: did_type,
                account: data.account,
                open: data.open,
                monotonic: data.monotonic,
                expired_at: data.expired_at,
                bytes: data.bytes,
                length: data.length,
            }
            return dto
        } 
        const errorCode = response.status
        const dto: DIDDTO = {
            status: 'error',
            error: 'Unknown Error',
            name: name,
            scope: scope,
            did_type: DIDType.UNKNOWN,
            account: '',
            open: false,
            monotonic: false,
            expired_at: '',
            bytes: 0,
            length: 0,
        }
        switch (errorCode) {
            case 400:
                dto.error = 'Invalid Parameters'
            case 401:
                dto.error = 'Invalid Auth Token'
                break
            case 404:
                const error = await response.json()
                if (error.exception === 'DataIdentifierNotFound') {
                    dto.error = 'Data Identifier Not Found'
                }
                if (error.exception === 'ScopeNotFound') {
                    dto.error = 'Scope Not Found'
                }
                break
            default:
                dto.error = 'Unknown Error'
                break
        }
        return dto
    }
}
