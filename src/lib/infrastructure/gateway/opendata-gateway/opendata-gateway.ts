import { ListOpenDataDIDsDTO, OpenDataDIDDTO } from '@/lib/core/dto/opendata-dto';
import OpenDataGatewayOutputPort from '@/lib/core/port/secondary/opendata-gateway-output-port';
import GetOpenDataDIDEndpoint from '@/lib/infrastructure/gateway/opendata-gateway/endpoints/get-opendata-did-endpoint';
import ListOpenDataDIDsEndpoint from '@/lib/infrastructure/gateway/opendata-gateway/endpoints/list-opendata-dids-endpoint';
import { injectable } from 'inversify';

@injectable()
export default class RucioOpenDataGateway implements OpenDataGatewayOutputPort {
    async getOpenDataDID(rucioAuthToken: string, scope: string, name: string): Promise<OpenDataDIDDTO> {
        try {
            const endpoint = new GetOpenDataDIDEndpoint(rucioAuthToken, scope, name);

            const dto: OpenDataDIDDTO = await endpoint.fetch();

            return Promise.resolve(dto);
        } catch (error) {
            const errorDTO: OpenDataDIDDTO = {
                status: 'error',
                scope,
                name,
                files: [],
                meta: {},
                errorName: 'Unknown Error',
                errorType: 'gateway_endpoint_error',
                errorCode: 500,
                errorMessage: error?.toString(),
            };

            return Promise.resolve(errorDTO);
        }
    }
    async listOpenDataDIDs(rucioAuthToken: string, limit?: number, offset?: number, state?: string): Promise<ListOpenDataDIDsDTO> {
        try {
            const endpoint = new ListOpenDataDIDsEndpoint(rucioAuthToken, limit, offset, state);

            const dto = await endpoint.fetch();

            if (dto.status === 'error' && dto.errorCode === 404) {
                return {
                    ...dto,
                    status: 'error',
                    total: 0,
                    offset: offset ?? 0,
                    dids: [],
                    errorName: 'OpenData Unsupported',
                    errorType: 'opendata_unsupported',
                    errorMessage: 'OpenData is not supported by this Rucio server.',
                };
            }

            return dto;
        } catch (error) {
            return {
                status: 'error',
                total: 0,
                offset: offset ?? 0,
                dids: [],
                errorName: 'Unknown Error',
                errorType: 'gateway_endpoint_error',
                errorCode: 500,
                errorMessage: error?.toString(),
            };
        }
    }
}
