import { injectable } from "inversify";
import type { ListDIDsInputPort, ListDIDsOutputPort } from "@/lib/core/port/primary/list-dids-ports";
import type DIDGatewayOutputPort from "@/lib/core/port/secondary/did-gateway-output-port";
import { DIDDTO, ListDIDDTO, ListDIDsStreamData } from "../../dto/did-dto";
import { ListDIDsError, ListDIDsRequest, ListDIDsResponse } from "../../usecase-models/list-dids-usecase-models";
import { parseDIDString } from "@/lib/common/did-utils";
import { BaseMultiCallStreamableUseCase, BaseStreamingUseCase } from "@/lib/sdk/usecase";
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { ListDIDsViewModel } from "@/lib/infrastructure/data/view-model/list-did";
import GetDIDsPipelineElement from "./pipeline-element-get-did";

@injectable()
class ListDIDsUseCase extends BaseMultiCallStreamableUseCase<ListDIDsRequest, ListDIDsResponse, ListDIDsError, ListDIDDTO, DIDDTO, ListDIDsViewModel> implements ListDIDsInputPort {
    
    constructor(
        protected presenter: ListDIDsOutputPort,
        private didGateway: DIDGatewayOutputPort,
    ) {
        const getDIDPipelineElement = new GetDIDsPipelineElement(didGateway);
        super(presenter, [getDIDPipelineElement])
        this.didGateway = didGateway;
    }
   
    validateRequestModel(requestModel: AuthenticatedRequestModel<ListDIDsRequest>): ListDIDsError | undefined {
        let scope: string;
        let name: string;
        try{
            let didComponents = parseDIDString(requestModel.query);
            scope = didComponents.scope;
            name = didComponents.name;
        } catch (error: any) {
            return {
                status: 'error',
                error: 'Invalid DID Query',
                message: (error as Error).message,
            } as ListDIDsError
        }
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListDIDsRequest>): Promise<ListDIDDTO> {
        const { scope, name } = parseDIDString(requestModel.query);
        const listDIDDTO: ListDIDDTO = await this.didGateway.listDIDs(requestModel.rucioAuthToken, scope, name, requestModel.type);
        return listDIDDTO;
    }

    handleGatewayError(error: ListDIDDTO): ListDIDsError {
        let errorType = 'Unknown Error'
        if(error.error === 'Invalid Auth Token') {
            errorType = 'Invalid Request'
        }
        else if(error.error !== 'Unknown Error') {
            errorType = 'Invalid DID Query'
        }
        
        return {
            error: errorType,
            message: `${error.error}: ${error.message}`,
        } as ListDIDsError
    }

    processStreamedData(dto: DIDDTO): { data: ListDIDsResponse | ListDIDsError; status: "success" | "error"; } {
        const responseModel: ListDIDsResponse = {
            status: 'success',
            name: dto.name,
            scope: dto.scope,
            did_type: dto.did_type,
            length: 0,
            bytes: 0,
        }
        return {
            data: responseModel,
            status: 'success',
        }
    }

    handleStreamError(error: ListDIDsError): void {
        this.emit('error', error)
    }

    validateFinalResponseModel(responseModel: ListDIDsResponse): { isValid: boolean; errorModel?: ListDIDsError | undefined; } {
        return {
            isValid: true,
        }
    }
}
    
export default ListDIDsUseCase;