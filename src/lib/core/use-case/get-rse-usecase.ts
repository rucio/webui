import { injectable } from "inversify";
import { BaseSingleEndpointUseCase } from "@/lib/sdk/usecase"
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";

import { GetRSEError, GetRSERequest, GetRSEResponse } from "@/lib/core/usecase-models/get-rse-usecase-models";
import { GetRSEInputPort, type GetRSEOutputPort } from "@/lib/core/port/primary/get-rse-ports";

import { RSEDTO } from "@/lib/core/dto/rse-dto";
import type RSEGatewayOutputPort from "@/lib/core/port/secondary/rse-gateway-output-port";

@injectable()
export default class GetRSEUseCase extends BaseSingleEndpointUseCase<AuthenticatedRequestModel<GetRSERequest>, GetRSEResponse, GetRSEError, RSEDTO> implements GetRSEInputPort {
   
    constructor(
        protected readonly presenter: GetRSEOutputPort,
        private readonly gateway: RSEGatewayOutputPort,
    ) {
        super(presenter);
    }
    
    validateRequestModel(requestModel: AuthenticatedRequestModel<GetRSERequest>): GetRSEError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<GetRSERequest>): Promise<RSEDTO> {
        const { rucioAuthToken, rseName } = requestModel;
        const dto: RSEDTO = await this.gateway.getRSE(rucioAuthToken, rseName);
        return dto;
        
    }
    handleGatewayError(error: RSEDTO): GetRSEError {
        return {
            status: 'error',
            message: error.errorMessage? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as GetRSEError
    }

    processDTO(dto: RSEDTO): { data: GetRSEResponse | GetRSEError; status: "success" | "error"; } {
        const responseModel: GetRSEResponse = {
            ...dto,
            status: 'success',
        }

        return {
            status: 'success',
            data: responseModel,
        }
    }
}