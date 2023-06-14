import { HTTPRequest } from '@/lib/common/stream/http'
import { DIDDTO, ListDIDDTO } from '@/lib/core/data/dto/did-dto'
import { DIDType } from '@/lib/core/entity/rucio'
import DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port'
import { injectable } from 'inversify'
import ListDIDsEndpoint from './endpoints/list-dids-endpoint'


@injectable()
export default class RucioDIDGateway implements DIDGatewayOutputPort {
    async listDIDs(
        rucioAuthToken: string,
        scope: string,
        name: string,
        type: DIDType,
    ): Promise<ListDIDDTO> {
        try {
            const endpoint = new ListDIDsEndpoint(rucioAuthToken, scope, name, type)
            await endpoint.fetch()
            const dto: ListDIDDTO = {
                status: 'success',
                stream: endpoint,
            }
            return Promise.resolve(dto)
        } catch (error) {
            const errorDTO: ListDIDDTO = {
                status: 'error',
                error: 'Unknown Error',
                message: error?.toString(),
            }
            return Promise.resolve(errorDTO)
        }
            
    }

    async getDID(
        rucioAuthToken: string,
        scope: string,
        name: string,
    ): Promise<DIDDTO> {
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
        const response = await fetch(endpoint, {
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
