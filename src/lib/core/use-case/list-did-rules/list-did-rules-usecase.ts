import { DIDRulesViewModel } from "@/lib/infrastructure/data/view-model/did";
import { BaseSingleEndpointPostProcessingPipelineStreamingUseCase } from "@/lib/sdk/usecase";
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { injectable } from "inversify";
import { DIDRulesDTO, ListDIDRulesDTO } from "../../dto/did-dto";
import { ListDIDRulesInputPort, type ListDIDRulesOutputPort } from "../../port/primary/list-did-rules-ports";
import type DIDGatewayOutputPort from "../../port/secondary/did-gateway-output-port";
import type SubscriptionGatewayOutputPort from "../../port/secondary/subscription-gateway-output-port";
import { ListDIDRulesError, ListDIDRulesResponse, ListDIDRulesRequest } from "../../usecase-models/list-did-rules-usecase-models";
import GetDIDSubscriptionsByIDPipelineElement from "./pipeline-element-get-did-subscription";

@injectable()
class ListDIDRulesUseCase extends BaseSingleEndpointPostProcessingPipelineStreamingUseCase<ListDIDRulesRequest, ListDIDRulesResponse, ListDIDRulesError, ListDIDRulesDTO, DIDRulesDTO, DIDRulesViewModel> implements ListDIDRulesInputPort {
    constructor(
        protected presenter: ListDIDRulesOutputPort,
        private didGateway: DIDGatewayOutputPort,
        subscriptionsGateway: SubscriptionGatewayOutputPort,
    ) {
        const getSubscriptionByIdPipelineElement: GetDIDSubscriptionsByIDPipelineElement = new GetDIDSubscriptionsByIDPipelineElement(subscriptionsGateway);
        super(presenter, [getSubscriptionByIdPipelineElement])
    }

    validateFinalResponseModel(responseModel: ListDIDRulesResponse): { isValid: boolean; errorModel?: ListDIDRulesError | undefined; } {
        if(!responseModel.subscription_name || !responseModel.subscription_account) {
            return {
                isValid: false,
                errorModel: {
                    status: 'error',
                    message: 'Subscription details not found',
                } as ListDIDRulesError
            }
        }

        return {
            isValid: true,
        }
    }
    

    validateRequestModel(requestModel: AuthenticatedRequestModel<ListDIDRulesRequest>): ListDIDRulesError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListDIDRulesRequest>): Promise<ListDIDRulesDTO> {
        const dto: ListDIDRulesDTO = await this.didGateway.listDIDRules(requestModel.rucioAuthToken, requestModel.scope, requestModel.name);
        return dto;
    }

    handleGatewayError(error: ListDIDRulesDTO): ListDIDRulesError {
        return {
            status: 'error',
            error: `Gateway retuned with ${error.errorCode}: ${error.errorMessage}`,
            message: error.errorMessage? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as ListDIDRulesError
    }

    processStreamedData(dto: DIDRulesDTO): { data: ListDIDRulesResponse | ListDIDRulesError; status: "error" | "success"; } {
        const responseModel: ListDIDRulesResponse = {
            ...dto,
            status: 'success',
        }
        return {
            data: responseModel,
            status: 'success',
        }
    }
}

export default ListDIDRulesUseCase;