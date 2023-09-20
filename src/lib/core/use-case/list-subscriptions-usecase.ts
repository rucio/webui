import { SubscriptionViewModel } from "@/lib/infrastructure/data/view-model/subscriptions";
import { BaseSingleEndpointStreamingUseCase } from "@/lib/sdk/usecase";
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { injectable } from "inversify";
import { ListSubscriptionsDTO, SubscriptionDTO } from "../dto/subscription-dto";
import { ListSubscriptionsInputPort, type ListSubscriptionsOutputPort } from "../port/primary/list-subscriptions-port";
import type SubscriptionGatewayOutputPort from "../port/secondary/subscription-gateway-output-port";
import { ListSubscriptionsError, ListSubscriptionsRequest, ListSubscriptionsResponse } from "../usecase-models/list-subscriptions-usecase-models";

@injectable()
class ListSubscriptionsUseCase extends BaseSingleEndpointStreamingUseCase<
    ListSubscriptionsRequest,
    ListSubscriptionsResponse,
    ListSubscriptionsError,
    ListSubscriptionsDTO,
    SubscriptionDTO,
    SubscriptionViewModel
    > implements ListSubscriptionsInputPort {

    constructor(
        protected presenter: ListSubscriptionsOutputPort,
        private subscriptionGateway: SubscriptionGatewayOutputPort
    ){
        super(presenter)
        this.subscriptionGateway = subscriptionGateway;
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<ListSubscriptionsRequest>): ListSubscriptionsError | undefined {
        if( requestModel.account == '' || requestModel.account == undefined) {
            return {
                status: 'error',
                error: 'INVALID_ACCOUNT',
                message: 'The account specified in the request is an empty string',
            } as ListSubscriptionsError
        }
    }
    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListSubscriptionsRequest>): Promise<ListSubscriptionsDTO> {
        const { rucioAuthToken, account } = requestModel;
        const dto: ListSubscriptionsDTO = await this.subscriptionGateway.list(rucioAuthToken, account);
        return dto;
    }

    handleGatewayError(error: ListSubscriptionsDTO): ListSubscriptionsError {
        return {
            status: 'error',
            error: `Gateway retuned with ${error.errorCode}: ${error.errorMessage}`,
            message: error.errorMessage? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as ListSubscriptionsError
    }

    processStreamedData(dto: SubscriptionDTO): { data: ListSubscriptionsError | ListSubscriptionsResponse; status: "success" | "error"; } {
        if(dto.status === 'error') {
            const errorModel: ListSubscriptionsError = {
                    status: 'error',
                    error: dto.errorName || 'Gateway Error',
                    code: dto.errorCode || 500,
                    message: dto.errorMessage || 'Could not fetch or process the fetched data',
                    name: dto.errorName || 'Gateway Error',
            }
            
            return {
                status: 'error',
                data: errorModel,
            }
        }

        const responseModel: ListSubscriptionsResponse = {
            ...dto,
            status: 'success',
        }
        return {
            data: responseModel,
            status: 'success',
        }
    }
}

export default ListSubscriptionsUseCase;