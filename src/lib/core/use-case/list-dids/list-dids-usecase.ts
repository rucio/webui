import { injectable } from 'inversify';
import type { ListDIDsInputPort, ListDIDsOutputPort } from '@/lib/core/port/primary/list-dids-ports';
import type DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';
import { DIDLongDTO, ListDIDDTO } from '../../dto/did-dto';
import { ListDIDsError, ListDIDsRequest, ListDIDsResponse } from '../../usecase-models/list-dids-usecase-models';
import { parseDIDString } from '@/lib/common/did-utils';
import { BaseSingleEndpointStreamingUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { DIDLong } from '../../entity/rucio';

@injectable()
class ListDIDsUseCase
    extends BaseSingleEndpointStreamingUseCase<ListDIDsRequest, ListDIDsResponse, ListDIDsError, ListDIDDTO, DIDLongDTO, ListDIDsViewModel>
    implements ListDIDsInputPort
{
    constructor(protected presenter: ListDIDsOutputPort, private didGateway: DIDGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<ListDIDsRequest>): ListDIDsError | undefined {
        let scope: string;
        let name: string;
        try {
            let didComponents = parseDIDString(requestModel.query);
            scope = didComponents.scope;
            name = didComponents.name;
        } catch (error: any) {
            return {
                status: 'error',
                error: 'Invalid DID Query',
                message: (error as Error).message,
            } as ListDIDsError;
        }
    }

    async intializeRequest(request: AuthenticatedRequestModel<ListDIDsRequest>): Promise<ListDIDsError | undefined> {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListDIDsRequest>): Promise<ListDIDDTO> {
        const { scope, name } = parseDIDString(requestModel.query);
        const listDIDDTO: ListDIDDTO = await this.didGateway.listDIDs(requestModel.rucioAuthToken, scope, name, requestModel.type);
        return listDIDDTO;
    }

    handleGatewayError(error: ListDIDDTO): ListDIDsError {
        let errorType = 'Unknown Error';
        let message = error.errorMessage;
        if (message === 'Invalid Auth Token') {
            errorType = 'Invalid Request';
        } else if (message !== 'Unknown Error') {
            errorType = 'Invalid DID Query';
        }
        return {
            error: errorType,
            message: `${error.errorCode}: ${error.errorMessage}`,
        } as ListDIDsError;
    }

    processStreamedData(dto: DIDLong): { data: ListDIDsResponse | ListDIDsError; status: 'success' | 'error' } {
        const errorModel: ListDIDsError = {
            status: 'error',
            code: 400,
            error: 'Invalid DID Query',
            message: 'Gateway recieved an invalid (undefined) DID for the query',
            name: 'Gateway Error: Undefined DID in stream',
        };
        if (dto.name === undefined) {
            return {
                status: 'error',
                data: errorModel,
            };
        }
        const responseModel: ListDIDsResponse = {
            status: 'success',
            name: dto.name,
            scope: dto.scope,
            did_type: dto.did_type,
            length: dto.length,
            bytes: dto.bytes,
        };
        return {
            data: responseModel,
            status: 'success',
        };
    }
}

export default ListDIDsUseCase;
