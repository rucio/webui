import { HTTPRequest } from '@/lib/common/stream/http'
import { Response } from 'node-fetch'
import DIDDTO from '@/lib/core/data/did-dto'
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
    ): Promise<DIDDTO> {
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
            const dto: DIDDTO = {
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
            const dto: DIDDTO = {
                status: 'success',
                error: undefined,
                stream: response,
            }
            return dto
        }
        const dto: DIDDTO = {
            status: 'error',
            error: 'Unknown Error',
            stream: null,
        }
        return dto
    }
}
