import { ListOpenDataDIDsDTO, OpenDataDIDDTO } from '@/lib/core/dto/opendata-dto';

export default interface OpenDataGatewayOutputPort {
    getOpenDataDID(rucioAuthToken: string, scope: string, name: string): Promise<OpenDataDIDDTO>;

    listOpenDataDIDs(rucioAuthToken: string, limit?: number, offset?: number, state?: string): Promise<ListOpenDataDIDsDTO>;
}
