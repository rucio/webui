import { BaseStreamingPostProcessingPipelineElement } from '@/lib/sdk/postprocessing-pipeline-elements';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { DIDExtendedDTO } from '@/lib/core/dto/did-dto';
import { DIDType } from '@/lib/core/entity/rucio';
import DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';
import {
    ListRulesPendingApprovalError,
    ListRulesPendingApprovalRequest,
    ListRulesPendingApprovalResponse,
} from '@/lib/core/usecase-models/list-rules-pending-approval-usecase-models';

/**
 * Pipeline element that enriches each rule with DID information (length, open, did_type, bytes)
 * by calling the GetDID endpoint for each streamed rule.
 */
export default class GetDIDForRulePipelineElement extends BaseStreamingPostProcessingPipelineElement<
    ListRulesPendingApprovalRequest,
    ListRulesPendingApprovalResponse,
    ListRulesPendingApprovalError,
    DIDExtendedDTO
> {
    constructor(private didGateway: DIDGatewayOutputPort) {
        super();
    }

    async makeGatewayRequest(
        requestModel: AuthenticatedRequestModel<ListRulesPendingApprovalRequest>,
        responseModel: ListRulesPendingApprovalResponse,
    ): Promise<DIDExtendedDTO> {
        try {
            // For datasets and containers, use dynamic_depth=FILE to compute
            // accurate bytes/length by resolving through child DIDs.
            // For files, dynamic_depth is a no-op so we skip it.
            const dynamicDepth =
                responseModel.did_type === DIDType.FILE ? undefined : DIDType.FILE;

            const dto: DIDExtendedDTO = await this.didGateway.getDID(
                requestModel.rucioAuthToken,
                responseModel.scope,
                responseModel.name,
                dynamicDepth,
            );
            return dto;
        } catch (error: any) {
            const errorDTO: DIDExtendedDTO = {
                status: 'error',
                errorName: 'DID Lookup Failed',
                errorMessage: (error as Error).message,
                name: responseModel.name,
                scope: responseModel.scope,
                did_type: responseModel.did_type,
                account: responseModel.account,
                open: false,
                monotonic: false,
                expired_at: '',
                bytes: 0,
                length: 0,
            };
            return errorDTO;
        }
    }

    handleGatewayError(dto: DIDExtendedDTO): ListRulesPendingApprovalError {
        let errorDescription: string;
        switch (dto.errorMessage) {
            case 'Invalid Auth Token':
                errorDescription = 'Authentication failed while looking up DID';
                break;
            case 'Data Identifier Not Found':
                errorDescription = `DID ${dto.scope}:${dto.name} not found`;
                break;
            case 'Scope Not Found':
                errorDescription = `Scope ${dto.scope} not found`;
                break;
            case 'Invalid Parameters':
                errorDescription = `Invalid parameters for DID lookup of ${dto.scope}:${dto.name}`;
                break;
            default:
                errorDescription = `Failed to look up DID ${dto.scope}:${dto.name}`;
                break;
        }

        return {
            status: 'error',
            error: 'DID Lookup Error',
            code: dto.errorCode ?? 500,
            name: 'DID Lookup Error',
            message: errorDescription,
        };
    }

    transformResponseModel(
        responseModel: ListRulesPendingApprovalResponse,
        dto: DIDExtendedDTO,
    ): ListRulesPendingApprovalResponse | ListRulesPendingApprovalError {
        if (dto.status === 'error') {
            return {
                status: 'error',
                error: 'DID Lookup Error',
                code: dto.errorCode ?? 500,
                name: 'DID Lookup Error',
                message: `Failed to look up DID ${responseModel.scope}:${responseModel.name}: ${dto.errorMessage}`,
            };
        }
        responseModel.bytes = dto.bytes;
        responseModel.length = dto.length;
        responseModel.open = dto.open;
        return responseModel;
    }
}
