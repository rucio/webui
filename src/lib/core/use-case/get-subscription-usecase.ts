import { BaseSingleEndpointUseCase } from "@/lib/sdk/usecase";
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { injectable } from "inversify";
import { SubscriptionDTO } from "../dto/subscription-dto";
import type { GetSubscriptionInputPort, GetSubscriptionOutputPort } from "../port/primary/get-subscription-ports";
import type SubscriptionGatewayOutputPort from "../port/secondary/subscription-gateway-output-port";
import { GetSubscriptionError, GetSubscriptionRequest, GetSubscriptionResponse } from "../usecase-models/get-subscription-usecase-models";


@injectable()
class GetSubscriptionUseCase extends BaseSingleEndpointUseCase<AuthenticatedRequestModel<GetSubscriptionRequest>, GetSubscriptionResponse, GetSubscriptionError, SubscriptionDTO> implements GetSubscriptionInputPort {
    constructor(
        protected readonly presenter: GetSubscriptionOutputPort,
        private readonly gateway: SubscriptionGatewayOutputPort,
    ){
        super(presenter)
    }
    validateRequestModel(requestModel: AuthenticatedRequestModel<GetSubscriptionRequest>): GetSubscriptionError | undefined {
        if(requestModel.account === '' || requestModel.account === undefined) {
            return {
                error: 'INVALID_REQUEST',
                message: 'Account is required',
            } as GetSubscriptionError
        }

        if(requestModel.rucioAuthToken === '' || requestModel.rucioAuthToken === undefined) {
            return {
                error: 'INVALID_AUTH',
                message: 'Auth token is required',
            } as GetSubscriptionError
        }
        return undefined;
    }
    
    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<GetSubscriptionRequest>): Promise<SubscriptionDTO> {
        const dto: SubscriptionDTO = await this.gateway.get(requestModel.rucioAuthToken, requestModel.account, requestModel.name);
        return dto;
    }

    handleGatewayError(error: SubscriptionDTO): GetSubscriptionError {
        return {
            status: 'error',
            error: error.errorMessage,
            message: `Gateway responded with ${error.errorCode}, ${error.errorMessage}`
        } as GetSubscriptionError
    }

    processDTO(dto: SubscriptionDTO): { data: GetSubscriptionResponse | GetSubscriptionError; status: "success" | "error"; } {
        // copy all fields from dto to response model except success
        const responseModel: GetSubscriptionResponse = {
            ...dto,
            status: 'success',
        }

        return {
            status: 'success',
            data: responseModel,
        }
    }
}

export default GetSubscriptionUseCase;