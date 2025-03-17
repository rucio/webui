import { injectable } from 'inversify';
import { BaseSingleEndpointStreamingUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import {
    ListExtendedDIDsError,
    ListExtendedDIDsRequest,
    ListExtendedDIDsResponse,
} from '@/lib/core/usecase-models/list-extended-dids-usecase-models';
import { ListExtendedDIDsInputPort, type ListExtendedDIDsOutputPort } from '@/lib/core/port/primary/list-extended-dids-ports';

import { DIDExtendedDTO, ListDIDDTO } from '@/lib/core/dto/did-dto';
import type DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';
import { ListDIDsError, ListDIDsRequest } from '@/lib/core/usecase-models/list-dids-usecase-models';
import { parseDIDString } from '@/lib/common/did-utils';
import { ListExtendedDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';

@injectable()
export default class ListExtendedDIDsUseCase
    extends BaseSingleEndpointStreamingUseCase<
        AuthenticatedRequestModel<ListExtendedDIDsRequest>,
        ListExtendedDIDsResponse,
        ListExtendedDIDsError,
        ListDIDDTO,
        DIDExtendedDTO,
        ListExtendedDIDsViewModel
    >
    implements ListExtendedDIDsInputPort
{
    async intializeRequest(
        request: AuthenticatedRequestModel<AuthenticatedRequestModel<ListExtendedDIDsRequest>>,
    ): Promise<ListExtendedDIDsError | undefined> {
        return undefined;
    }
    processStreamedData(dto: DIDExtendedDTO): { data: ListExtendedDIDsResponse | ListExtendedDIDsError; status: 'success' | 'error' } {
        const responseModel: ListExtendedDIDsResponse = {
            ...dto,
            status: 'success',
        };
        return {
            data: responseModel,
            status: 'success',
        };
    }

    constructor(protected readonly presenter: ListExtendedDIDsOutputPort, private readonly gateway: DIDGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<ListDIDsRequest>): ListDIDsError | undefined {
        try {
            parseDIDString(requestModel.query);
        } catch (error: any) {
            return {
                status: 'error',
                error: 'Invalid DID Query',
                message: (error as Error).message,
            } as ListDIDsError;
        }
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListExtendedDIDsRequest>): Promise<ListDIDDTO> {
        const { scope, name } = parseDIDString(requestModel.query);
        const listDIDDTO: ListDIDDTO = await this.gateway.listExtendedDIDs(requestModel.rucioAuthToken, scope, name, requestModel.type);
        return listDIDDTO;
    }
    handleGatewayError(error: DIDExtendedDTO): ListExtendedDIDsError {
        return {
            status: 'error',
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as ListExtendedDIDsError;
    }

    processDTO(dto: DIDExtendedDTO): { data: ListExtendedDIDsResponse | ListExtendedDIDsError; status: 'success' | 'error' } {
        const responseModel: ListExtendedDIDsResponse = {
            ...dto,
            status: 'success',
        };

        return {
            status: 'success',
            data: responseModel,
        };
    }
}
