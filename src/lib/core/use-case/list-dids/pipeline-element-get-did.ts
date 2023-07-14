import { parseDIDString } from "@/lib/common/did-utils";
import { BaseStreamingPostProcessingPipelineElement } from "@/lib/sdk/postprocessing-pipeline-elements";
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { inject } from "inversify";
import { DIDDTO } from "../../dto/did-dto";
import DIDGatewayOutputPort from "../../port/secondary/did-gateway-output-port";
import { ListDIDsError, ListDIDsRequest, ListDIDsResponse } from "../../usecase-models/list-dids-usecase-models";

export default class GetDIDsPipelineElement extends BaseStreamingPostProcessingPipelineElement<ListDIDsRequest, ListDIDsResponse, ListDIDsError, DIDDTO>{
    constructor(private didGateway: DIDGatewayOutputPort) {
        super();
    }
    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListDIDsRequest>, responseModel: ListDIDsResponse): Promise<DIDDTO> {
        let scope: string = '';
        let name: string = '';
        try {
            const parsedDID  = parseDIDString(requestModel.query);
            scope = parsedDID.scope;
            name = parsedDID.name;
            const dto: DIDDTO = await this.didGateway.getDID(requestModel.rucioAuthToken, scope, name);
            return dto;
        } catch (error: any) {
            const errorDTO: DIDDTO = {
                status: 'error',
                error: 'Invalid Parameters',
                message: (error as Error).message,
                name: requestModel.query,
                scope: requestModel.query,
                did_type: requestModel.type,
                account: '',
                open: false,
                monotonic: false,
                expired_at: '',
                bytes: 0,
                length: 0
            }
            return errorDTO;
        }
    }

    handleGatewayError(dto: DIDDTO): ListDIDsError {
        let error: 'Unknown Error' | 'Invalid DID Query' | 'Invalid Request' = 'Unknown Error';
        switch(dto.error) {
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
            message: dto.error + ': ' + dto.message + ' for DID ' + dto.scope + ':' + dto.name,
        }
        return errorModel;
    }

    validateDTO(dto: DIDDTO): { status: "success" | "error" | "critical"; data: ListDIDsError | DIDDTO; } {
        if(dto.expired_at === '') {
            dto.expired_at = 'Never';
        }

        return {
            status: 'success',
            data: dto
        }
    }

   
    transformResponseModel(responseModel: ListDIDsResponse, dto: DIDDTO): ListDIDsResponse {
        responseModel.bytes = dto.bytes;
        responseModel.length = dto.length;
        return responseModel;
    }

}