import { getEmptySubscriptionDTO } from '@/lib/infrastructure/gateway/subscription-gateway/subscription-gateway-utils';
import { BaseStreamingPostProcessingPipelineElement } from '@/lib/sdk/postprocessing-pipeline-elements';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { SubscriptionDTO } from '../../dto/subscription-dto';
import SubscriptionGatewayOutputPort from '../../port/secondary/subscription-gateway-output-port';
import { ListDIDRulesError, ListDIDRulesResponse, ListDIDRulesRequest } from '../../usecase-models/list-did-rules-usecase-models';

export default class GetDIDSubscriptionsByIDPipelineElement extends BaseStreamingPostProcessingPipelineElement<
    ListDIDRulesRequest,
    ListDIDRulesResponse,
    ListDIDRulesError,
    SubscriptionDTO
> {
    constructor(private subscriptionsGateway: SubscriptionGatewayOutputPort) {
        super();
    }

    async makeGatewayRequest(
        requestModel: AuthenticatedRequestModel<ListDIDRulesRequest>,
        responseModel: ListDIDRulesResponse,
    ): Promise<SubscriptionDTO> {
        try {
            if (!responseModel.subscription_id) {
                const errorDTO: SubscriptionDTO = getEmptySubscriptionDTO('error');
                errorDTO.errorName = 'Invalid Request';
                errorDTO.errorMessage = 'Subscription ID not provided';
                return Promise.resolve(errorDTO);
            }
            const dto: SubscriptionDTO = await this.subscriptionsGateway.getById(requestModel.rucioAuthToken, responseModel.subscription_id);
            return Promise.resolve(dto);
        } catch (error) {
            const errorDTO: SubscriptionDTO = getEmptySubscriptionDTO('error');
            errorDTO.errorName = 'Unknown Error';
            errorDTO.errorMessage = error?.toString();
            return Promise.resolve(errorDTO);
        }
    }

    handleGatewayError(error: SubscriptionDTO): ListDIDRulesError {
        const errorModel: ListDIDRulesError = {
            status: 'error',
            message: error.errorMessage ?? 'Unknown Error',
            code: error.errorCode ?? -1,
            name: error.errorName ?? 'Unknown Error',
        };
        return errorModel;
    }

    transformResponseModel(responseModel: ListDIDRulesResponse, dto: SubscriptionDTO): ListDIDRulesResponse | ListDIDRulesError {
        responseModel.subscription_name = dto.name;
        responseModel.subscription_account = dto.account;
        return responseModel;
    }
}
