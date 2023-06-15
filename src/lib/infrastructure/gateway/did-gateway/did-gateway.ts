import { HTTPRequest } from '@/lib/common/stream/http'
import { DIDDTO, ListDIDDTO } from '@/lib/core/data/dto/did-dto'
import { DIDType } from '@/lib/core/entity/rucio'
import DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port'
import { injectable } from 'inversify'
import GetDIDEndpoint from './endpoints/get-did-endpoint'
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
        const endpoint = new GetDIDEndpoint(rucioAuthToken, scope, name)
        const dto = await endpoint.fetch()
        return dto
    }
}
