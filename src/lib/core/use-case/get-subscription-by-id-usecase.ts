import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { injectable } from 'inversify';
import {
    GetSubscriptionByIdError,
    GetSubscriptionByIdRequest,
    GetSubscriptionByIdResponse,
} from '../usecase-models/get-subscription-by-id-usecase-models';
import { SubscriptionDTO } from '../dto/subscription-dto';
import type { GetSubscriptionByIdInputPort, GetSubscriptionByIdOutputPort } from '../port/primary/get-subscription-by-id-ports';
import SubscriptionGateway from '@/lib/infrastructure/gateway/subscription-gateway/subscription-gateway';

@injectable()
class GetSubscriptionByIdUseCase
    extends BaseSingleEndpointUseCase<
        AuthenticatedRequestModel<GetSubscriptionByIdRequest>,
        GetSubscriptionByIdResponse,
        GetSubscriptionByIdError,
        SubscriptionDTO
    >
    implements GetSubscriptionByIdInputPort
{
    constructor(protected readonly presenter: GetSubscriptionByIdOutputPort, private readonly gateway: SubscriptionGateway) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<GetSubscriptionByIdRequest>): GetSubscriptionByIdError | undefined {
        if (requestModel.id === '' || requestModel.id === undefined) {
            return {
                error: 'INVALID_ID',
                message: 'Subscription ID is required',
            } as GetSubscriptionByIdError;
        }

        if (requestModel.rucioAuthToken === '' || requestModel.rucioAuthToken === undefined) {
            return {
                error: 'INVALID_AUTH',
                message: 'Account is required',
            } as GetSubscriptionByIdError;
        }

        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<GetSubscriptionByIdRequest>): Promise<SubscriptionDTO> {
        const dto = await this.gateway.getById(requestModel.rucioAuthToken, requestModel.id);
        return dto;
    }

    handleGatewayError(error: SubscriptionDTO): GetSubscriptionByIdError {
        return {
            status: 'error',
            error: error.errorMessage,
            message: `Gateway responded with ${error.errorCode} ${error.errorMessage}`,
        } as GetSubscriptionByIdError;
    }

    processDTO(dto: SubscriptionDTO): { data: GetSubscriptionByIdResponse | GetSubscriptionByIdError; status: 'success' | 'error' } {
        const responseModel: GetSubscriptionByIdResponse = {
            ...dto,
            status: 'success',
        };

        return {
            status: 'success',
            data: responseModel,
        };
    }
}

export default GetSubscriptionByIdUseCase;
