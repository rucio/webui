import { injectable } from "inversify";
import { BaseSingleEndpointUseCase } from "@/lib/sdk/usecase"
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";

import { GetRSEProtocolsError, GetRSEProtocolsRequest, GetRSEProtocolsResponse } from "@/lib/core/usecase-models/get-rse-protocols-usecase-models";
import { GetRSEProtocolsInputPort, type GetRSEProtocolsOutputPort } from "@/lib/core/port/primary/get-rse-protocols-ports";

import { RSEProtocolDTO } from "@/lib/core/dto/rse-dto";
import type RSEGatewayOutputPort from "@/lib/core/port/secondary/rse-gateway-output-port";

@injectable()
export default class GetRSEProtocolsUseCase extends BaseSingleEndpointUseCase<AuthenticatedRequestModel<GetRSEProtocolsRequest>, GetRSEProtocolsResponse, GetRSEProtocolsError, RSEProtocolDTO> implements GetRSEProtocolsInputPort {
   
    constructor(
        protected readonly presenter: GetRSEProtocolsOutputPort,
        private readonly gateway: RSEGatewayOutputPort,
    ) {
        super(presenter);
    }
    
    validateRequestModel(requestModel: AuthenticatedRequestModel<GetRSEProtocolsRequest>): GetRSEProtocolsError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<GetRSEProtocolsRequest>): Promise<RSEProtocolDTO> {
        const { rucioAuthToken, rseName } = requestModel;
        const dto: RSEProtocolDTO = await this.gateway.getRSEProtocols(rucioAuthToken, rseName);
        return dto;
        
    }
    handleGatewayError(error: RSEProtocolDTO): GetRSEProtocolsError {
        return {
            status: 'error',
            message: error.errorMessage? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as GetRSEProtocolsError
    }

    processDTO(dto: RSEProtocolDTO): { data: GetRSEProtocolsResponse | GetRSEProtocolsError; status: "success" | "error"; } {
        const responseModel: GetRSEProtocolsResponse = {
            ...dto,
            status: 'success',
        }

        return {
            status: 'success',
            data: responseModel,
        }
    }
}