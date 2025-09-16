import { injectable } from 'inversify';
import type { ListDIDsInputPort, ListDIDsOutputPort } from '@/lib/core/port/primary/list-dids-ports';
import type DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';
import { DIDExtendedDTO, ListDIDDTO, ListDIDsStreamData } from '../../dto/did-dto';
import { ListDIDsError, ListDIDsRequest, ListDIDsResponse } from '../../usecase-models/list-dids-usecase-models';
import { parseDIDString } from '@/lib/common/did-utils';
import { BaseSingleEndpointPostProcessingPipelineStreamingUseCase, BaseSingleEndpointStreamingUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import GetDIDsPipelineElement from './pipeline-element-get-did';
import { DID } from '../../entity/rucio';

@injectable()
class ListDIDsUseCase
    extends BaseSingleEndpointPostProcessingPipelineStreamingUseCase<
        ListDIDsRequest,
        ListDIDsResponse,
        ListDIDsError,
        ListDIDDTO,
        DIDExtendedDTO,
        ListDIDsViewModel
    >
    implements ListDIDsInputPort
{
    constructor(protected presenter: ListDIDsOutputPort, private didGateway: DIDGatewayOutputPort) {
        const getDIDPipelineElement = new GetDIDsPipelineElement(didGateway);
        super(presenter, [getDIDPipelineElement]);
        this.didGateway = didGateway;
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
        const listDIDDTO: ListDIDDTO = await this.didGateway.listDIDs(requestModel.rucioAuthToken, scope, name, requestModel.type, requestModel.filters);
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

    processStreamedData(dto: DID): { data: ListDIDsResponse | ListDIDsError; status: 'success' | 'error' } {
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
            length: 0,
            bytes: 0,
            open: false, // This is updated in the pipeline element that follows this usecase
        };
        return {
            data: responseModel,
            status: 'success',
        };
    }

    validateFinalResponseModel(responseModel: ListDIDsResponse): { isValid: boolean; errorModel?: ListDIDsError | undefined } {
        return {
            isValid: true,
        };
    }
}

export default ListDIDsUseCase;
