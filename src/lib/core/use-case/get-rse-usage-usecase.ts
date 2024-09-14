import { injectable } from "inversify";
import { BaseSingleEndpointUseCase } from "@/lib/sdk/usecase"
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";

import { GetRSEUsageError, GetRSEUsageRequest, GetRSEUsageResponse } from "@/lib/core/usecase-models/get-rse-usage-usecase-models";
import { GetRSEUsageInputPort, type GetRSEUsageOutputPort } from "@/lib/core/port/primary/get-rse-usage-ports";

import { RSEUsageDTO } from "@/lib/core/dto/rse-dto";
import type RSEGatewayOutputPort from "@/lib/core/port/secondary/rse-gateway-output-port";

@injectable()
export default class GetRSEUsageUseCase extends BaseSingleEndpointUseCase<AuthenticatedRequestModel<GetRSEUsageRequest>, GetRSEUsageResponse, GetRSEUsageError, RSEUsageDTO> implements GetRSEUsageInputPort {
   
    constructor(
        protected readonly presenter: GetRSEUsageOutputPort,
        private readonly gateway: RSEGatewayOutputPort,
    ) {
        super(presenter);
    }
    
    validateRequestModel(requestModel: AuthenticatedRequestModel<GetRSEUsageRequest>): GetRSEUsageError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<GetRSEUsageRequest>): Promise<RSEUsageDTO> {
        const { rucioAuthToken, rseName } = requestModel;
        const dto: RSEUsageDTO = await this.gateway.getRSEUsage(rucioAuthToken, rseName);
        return dto;
    }
    handleGatewayError(error: RSEUsageDTO): GetRSEUsageError {
        return {
            status: 'error',
            message: error.errorMessage? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as GetRSEUsageError
    }

    processDTO(dto: RSEUsageDTO): { data: GetRSEUsageResponse | GetRSEUsageError; status: "success" | "error"; } {
        const responseModel: GetRSEUsageResponse = {
            ...dto,
            status: 'success',
        }

        return {
            status: 'success',
            data: responseModel,
        }
    }
}