import { injectable } from "inversify";
import { BaseSingleEndpointUseCase } from "@/lib/sdk/usecase"
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";

import { GetAccountInfoError, GetAccountInfoRequest, GetAccountInfoResponse } from "@/lib/core/usecase-models/get-account-info-usecase-models";
import { GetAccountInfoInputPort, type GetAccountInfoOutputPort } from "@/lib/core/port/primary/get-account-info-ports";

import { AccountInfoDTO } from "@/lib/core/dto/account-dto";
import type AccountGatewayOutputPort from "@/lib/core/port/secondary/account-gateway-output-port";

@injectable()
export default class GetAccountInfoUseCase extends BaseSingleEndpointUseCase<AuthenticatedRequestModel<GetAccountInfoRequest>, GetAccountInfoResponse, GetAccountInfoError, AccountInfoDTO> implements GetAccountInfoInputPort {
   
    constructor(
        protected readonly presenter: GetAccountInfoOutputPort,
        private readonly gateway: AccountGatewayOutputPort,
    ) {
        super(presenter);
    }
    
    validateRequestModel(requestModel: AuthenticatedRequestModel<GetAccountInfoRequest>): GetAccountInfoError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<GetAccountInfoRequest>): Promise<AccountInfoDTO> {
        const { rucioAuthToken, account } = requestModel;
        const dto: AccountInfoDTO = await this.gateway.getAccountInfo(account, rucioAuthToken);
        return dto;
        
    }
    handleGatewayError(error: AccountInfoDTO): GetAccountInfoError {
        return {
            status: 'error',
            message: error.errorMessage? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as GetAccountInfoError
    }

    processDTO(dto: AccountInfoDTO): { data: GetAccountInfoResponse | GetAccountInfoError; status: "success" | "error"; } {
        // copy all fields from dto to response model except success
        const responseModel: GetAccountInfoResponse = {
            ...dto,
            status: 'success',
        }

        return {
            status: 'success',
            data: responseModel,
        }
    }
}