import { injectable } from 'inversify';
import { BaseSingleEndpointStreamingUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import {
    ListSubscriptionRuleStatesError,
    ListSubscriptionRuleStatesRequest,
    ListSubscriptionRuleStatesResponse,
} from '@/lib/core/usecase-models/list-subscription-rule-states-usecase-models';
import {
    ListSubscriptionRuleStatesInputPort,
    type ListSubscriptionRuleStatesOutputPort,
} from '@/lib/core/port/primary/list-subscription-rule-states-ports';
import { SubscriptionRuleStatesViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';

import { BaseStreamableDTO } from '@/lib/sdk/dto';
import { SubscriptionRuleStateDTO } from '@/lib/core/dto/subscription-dto';
import type RSEGatewayOutputPort from '@/lib/core/port/secondary/subscription-gateway-output-port';
import { RuleState } from '../entity/rucio';
import { TransformCallback } from 'stream';

@injectable()
export default class ListSubscriptionRuleStatesUseCase
    extends BaseSingleEndpointStreamingUseCase<
        AuthenticatedRequestModel<ListSubscriptionRuleStatesRequest>,
        ListSubscriptionRuleStatesResponse,
        ListSubscriptionRuleStatesError,
        BaseStreamableDTO,
        SubscriptionRuleStateDTO,
        SubscriptionRuleStatesViewModel
    >
    implements ListSubscriptionRuleStatesInputPort
{
    constructor(
        protected readonly presenter: ListSubscriptionRuleStatesOutputPort,
        private readonly gateway: RSEGatewayOutputPort,
        private responseModels: ListSubscriptionRuleStatesResponse[] = [],
        private errorModels: ListSubscriptionRuleStatesError[] = [],
    ) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<ListSubscriptionRuleStatesRequest>): ListSubscriptionRuleStatesError | undefined {
        return undefined;
    }

    async intializeRequest(
        request: AuthenticatedRequestModel<AuthenticatedRequestModel<ListSubscriptionRuleStatesRequest>>,
    ): Promise<ListSubscriptionRuleStatesError | undefined> {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListSubscriptionRuleStatesRequest>): Promise<BaseStreamableDTO> {
        const { rucioAuthToken, account } = requestModel;
        const dto: BaseStreamableDTO = await this.gateway.listSubscriptionRuleStates(rucioAuthToken, account);
        return dto;
    }

    handleGatewayError(error: BaseStreamableDTO): ListSubscriptionRuleStatesError {
        return {
            status: 'error',
            error: `Gateway retuned with ${error.errorCode}: ${error.errorMessage}`,
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as ListSubscriptionRuleStatesError;
    }

    mergeResponseModels(
        existingModel: ListSubscriptionRuleStatesResponse,
        newModel: ListSubscriptionRuleStatesResponse,
    ): ListSubscriptionRuleStatesResponse {
        return {
            status: 'success',
            name: existingModel.name,
            state_ok: existingModel.state_ok + newModel.state_ok,
            state_replicating: existingModel.state_replicating + newModel.state_replicating,
            state_stuck: existingModel.state_stuck + newModel.state_stuck,
            state_suspended: existingModel.state_suspended + newModel.state_suspended,
            state_inject: existingModel.state_inject + newModel.state_inject,
            state_waiting_approval: existingModel.state_waiting_approval + newModel.state_waiting_approval,
        };
    }

    addOrUpdateSubscriptionRuleState(ruleStateDTO: SubscriptionRuleStateDTO): ListSubscriptionRuleStatesResponse {
        let existingEntryIndex = this.responseModels.findIndex(rs => rs.name === ruleStateDTO.subscriptionName);
        const newEntry: ListSubscriptionRuleStatesResponse = {
            status: 'success',
            name: ruleStateDTO.subscriptionName,
            state_ok: 0,
            state_replicating: 0,
            state_stuck: 0,
            state_suspended: 0,
            state_inject: 0,
            state_waiting_approval: 0,
        };

        switch (ruleStateDTO.state) {
            case RuleState.OK:
                newEntry.state_ok += ruleStateDTO.count;
                break;
            case RuleState.REPLICATING:
                newEntry.state_replicating += ruleStateDTO.count;
                break;
            case RuleState.STUCK:
                newEntry.state_stuck += ruleStateDTO.count;
                break;
            case RuleState.SUSPENDED:
                newEntry.state_suspended += ruleStateDTO.count;
                break;
            case RuleState.INJECT:
                newEntry.state_inject += ruleStateDTO.count;
                break;
            case RuleState.WAITING_APPROVAL:
                newEntry.state_waiting_approval += ruleStateDTO.count;
                break;
            default:
                break;
        }
        if (existingEntryIndex != -1) {
            const mergedEntry = this.mergeResponseModels(this.responseModels[existingEntryIndex], newEntry);
            this.responseModels[existingEntryIndex] = mergedEntry;
            return mergedEntry;
        } else {
            this.responseModels.push(newEntry);
            return newEntry;
        }
    }

    processStreamedData(dto: SubscriptionRuleStateDTO): {
        data: ListSubscriptionRuleStatesResponse | ListSubscriptionRuleStatesError;
        status: 'success' | 'error';
    } {
        // TODO: process streamed data
        if (dto.status === 'error') {
            const errorModel: ListSubscriptionRuleStatesError = {
                status: 'error',
                code: dto.errorCode || 500,
                message: dto.errorMessage || 'Could not fetch or process the fetched data',
                name: dto.errorName || 'Gateway Error',
            };
            return {
                status: 'error',
                data: errorModel,
            };
        }

        try {
            const responseModel = this.addOrUpdateSubscriptionRuleState(dto);
            return {
                status: 'pending' as any, // intentional use of any
                data: responseModel,
            };
        } catch (error: any) {
            return {
                status: 'error',
                data: {
                    status: 'error',
                    code: 500,
                    message: error.toString(),
                    name: 'Error while processing streamed data',
                } as ListSubscriptionRuleStatesError,
            };
        }
    }

    /**
     * @override
     */
    _transform(dto: SubscriptionRuleStateDTO, encoding: BufferEncoding, callback: TransformCallback): void {
        const { status, data } = this.processStreamedData(dto);
        if (status === 'error') {
            // Do not push the response model to the stream as it may be updated in future streamed dto's
            const errorModel = data as ListSubscriptionRuleStatesError;
            // push the errors as soon as they arrive
            callback(null, errorModel);
        }
        callback(null);
    }

    /**
     * @override
     */
    _flush(callback: TransformCallback): void {
        this.responseModels.forEach(responseModel => {
            this.push(responseModel);
        });
        this.responseModels = [];
        callback(null);
    }
}
