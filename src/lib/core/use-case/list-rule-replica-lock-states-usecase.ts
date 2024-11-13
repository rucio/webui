import { injectable } from 'inversify';
import { BaseSingleEndpointStreamingUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import {
    ListRuleReplicaLockStatesError,
    ListRuleReplicaLockStatesRequest,
    ListRuleReplicaLockStatesResponse,
} from '@/lib/core/usecase-models/list-rule-replica-lock-states-usecase-models';
import {
    ListRuleReplicaLockStatesInputPort,
    type ListRuleReplicaLockStatesOutputPort,
} from '@/lib/core/port/primary/list-rule-replica-lock-states-ports';
import { ListRuleReplicaLockStatesViewModel } from '@/lib/infrastructure/data/view-model/rule';

import { RuleReplicaLockStateDTO, ListLocksDTO } from '@/lib/core/dto/rule-dto';
import type RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';

@injectable()
export default class ListRuleReplicaLockStatesUseCase
    extends BaseSingleEndpointStreamingUseCase<
        AuthenticatedRequestModel<ListRuleReplicaLockStatesRequest>,
        ListRuleReplicaLockStatesResponse,
        ListRuleReplicaLockStatesError,
        ListLocksDTO,
        RuleReplicaLockStateDTO,
        ListRuleReplicaLockStatesViewModel
    >
    implements ListRuleReplicaLockStatesInputPort
{
    constructor(protected readonly presenter: ListRuleReplicaLockStatesOutputPort, private readonly gateway: RuleGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<ListRuleReplicaLockStatesRequest>): ListRuleReplicaLockStatesError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListRuleReplicaLockStatesRequest>): Promise<ListLocksDTO> {
        const { rucioAuthToken, id } = requestModel;
        return await this.gateway.listRuleReplicaLockStates(rucioAuthToken, id);
    }

    handleGatewayError(error: RuleReplicaLockStateDTO): ListRuleReplicaLockStatesError {
        return {
            status: 'error',
            error: `Gateway retuned with ${error.errorCode}: ${error.errorMessage}`,
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as ListRuleReplicaLockStatesError;
    }

    processStreamedData(dto: RuleReplicaLockStateDTO): {
        data: ListRuleReplicaLockStatesResponse | ListRuleReplicaLockStatesError;
        status: 'success' | 'error';
    } {
        if (dto.status === 'error') {
            const errorModel: ListRuleReplicaLockStatesError = {
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

        const responseModel: ListRuleReplicaLockStatesResponse = {
            ...dto,
            status: 'success',
            ddm_link: '',
            fts_link: '',
        };
        return {
            status: 'success',
            data: responseModel,
        };
    }

    intializeRequest(
        request: AuthenticatedRequestModel<AuthenticatedRequestModel<ListRuleReplicaLockStatesRequest>>,
    ): Promise<undefined | ListRuleReplicaLockStatesError> {
        return Promise.resolve(undefined);
    }
}
