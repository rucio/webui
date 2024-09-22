import { injectable } from "inversify";
import { BaseSingleEndpointUseCase } from "@/lib/sdk/usecase"
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";

import { AttachDIDsError, AttachDIDsRequest, AttachDIDsResponse } from "@/lib/core/usecase-models/attach-dids-usecase-models";
import { AttachDIDsInputPort, type AttachDIDsOutputPort } from "@/lib/core/port/primary/attach-dids-ports";

import { AttachDIDDTO } from "@/lib/core/dto/did-dto";
import type DIDGatewayOutputPort from "@/lib/core/port/secondary/did-gateway-output-port";
import {DID} from "@/lib/core/entity/rucio";

@injectable()
export default class AttachDIDsUseCase extends BaseSingleEndpointUseCase<AuthenticatedRequestModel<AttachDIDsRequest>, AttachDIDsResponse, AttachDIDsError, AttachDIDDTO> implements AttachDIDsInputPort {
   
    constructor(
        protected readonly presenter: AttachDIDsOutputPort,
        private readonly gateway: DIDGatewayOutputPort,
    ) {
        super(presenter);
    }
    
    validateRequestModel(requestModel: AuthenticatedRequestModel<AttachDIDsRequest>): AttachDIDsError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<AttachDIDsRequest>): Promise<AttachDIDDTO> {
        const { rucioAuthToken, scope, name, dids } = requestModel;
        const dto: AttachDIDDTO = await this.gateway.attachDIDs(rucioAuthToken, scope, name, dids as DID[]);
        return dto;
        
    }
    handleGatewayError(error: AttachDIDDTO): AttachDIDsError {
        return {
            status: 'error',
            message: error.errorMessage? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as AttachDIDsError
    }

    processDTO(dto: AttachDIDDTO): { data: AttachDIDsResponse | AttachDIDsError; status: "success" | "error"; } {
        // copy all fields from dto to response model except success
        const responseModel: AttachDIDsResponse = {
            ...dto,
            status: 'success',
        }

        return {
            status: 'success',
            data: responseModel,
        }
    }
}