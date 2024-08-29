import { BaseStreamingPostProcessingPipelineElement } from '@/lib/sdk/postprocessing-pipeline-elements';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { DIDExtendedDTO, DIDMetaDTO } from '../../dto/did-dto';
import { DIDType } from '../../entity/rucio';
import DIDGatewayOutputPort from '../../port/secondary/did-gateway-output-port';
import { ListDIDsError, ListDIDsRequest, ListDIDsResponse } from '../../usecase-models/list-dids-usecase-models';

export default class GetDIDsPipelineElement extends BaseStreamingPostProcessingPipelineElement<
    ListDIDsRequest,
    ListDIDsResponse,
    ListDIDsError,
    DIDExtendedDTO
> {
    constructor(private didGateway: DIDGatewayOutputPort) {
        super();
    }
    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListDIDsRequest>, responseModel: ListDIDsResponse): Promise<DIDExtendedDTO> {
        try {
            const dto: DIDExtendedDTO = await this.didGateway.getDID(
                requestModel.rucioAuthToken,
                responseModel.scope,
                responseModel.name,
                DIDType.FILE,
            );
            return dto;
        } catch (error: any) {
            const errorDTO: DIDExtendedDTO = {
                status: 'error',
                errorName: 'Unknown Error',
                errorMessage: (error as Error).message,
                name: requestModel.query,
                scope: requestModel.query,
                did_type: requestModel.type,
                account: '',
                open: false,
                monotonic: false,
                expired_at: '',
                bytes: 0,
                length: 0,
            };
            return errorDTO;
        }
    }

    handleGatewayError(dto: DIDExtendedDTO): ListDIDsError {
        let error: 'Unknown Error' | 'Invalid DID Query' | 'Invalid Request' = 'Unknown Error';
        switch (dto.errorMessage) {
            case 'Invalid Auth Token':
                error = 'Invalid Request';
                break;
            case 'Data Identifier Not Found':
                error = 'Invalid DID Query';
                break;
            case 'Invalid Parameters':
                error = 'Invalid Request';
                break;
            case 'Scope Not Found':
                error = 'Invalid DID Query';
                break;
            case 'Unknown Error':
                error = 'Unknown Error';
                break;
            default:
                error = 'Unknown Error';
                break;
        }

        const errorModel: ListDIDsError = {
            status: 'error',
            name: dto.name,
            error: error,
            code: dto.errorCode ? dto.errorCode : 400,
            message: dto.errorName + ': ' + dto.errorMessage + ' for DID ' + dto.scope + ':' + dto.name,
        };
        return errorModel;
    }

    validateDTO(dto: DIDExtendedDTO): { status: 'success' | 'error' | 'critical'; data: ListDIDsError | DIDExtendedDTO } {
        if (dto.expired_at === '') {
            dto.expired_at = 'Never';
        }

        return {
            status: 'success',
            data: dto,
        };
    }

    transformResponseModel(responseModel: ListDIDsResponse, dto: DIDExtendedDTO): ListDIDsResponse | ListDIDsError {
        if (dto.status === 'error')
            return {
                status: 'error',
                name: '',
                message: '',
                error: '',
                code: 500,
            };
        responseModel.bytes = dto.bytes;
        responseModel.length = dto.length;
        responseModel.did_type = dto.did_type;
        responseModel.open = dto.open;
        return responseModel;
    }
}
