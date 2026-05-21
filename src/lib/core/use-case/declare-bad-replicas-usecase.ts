import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import {
    DeclareBadReplicasError,
    DeclareBadReplicasRequest,
    DeclareBadReplicasResponse,
} from '@/lib/core/usecase-models/declare-bad-replicas-usecase-models';
import { DeclareBadReplicasInputPort, type DeclareBadReplicasOutputPort } from '@/lib/core/port/primary/declare-bad-replicas-ports';
import { DeclareBadReplicasDTO } from '@/lib/core/dto/replica-dto';
import type ReplicaGatewayOutputPort from '@/lib/core/port/secondary/replica-gateway-output-port';

@injectable()
export default class DeclareBadReplicasUseCase
    extends BaseSingleEndpointUseCase<
        AuthenticatedRequestModel<DeclareBadReplicasRequest>,
        DeclareBadReplicasResponse,
        DeclareBadReplicasError,
        DeclareBadReplicasDTO
    >
    implements DeclareBadReplicasInputPort
{
    constructor(protected readonly presenter: DeclareBadReplicasOutputPort, private readonly gateway: ReplicaGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<DeclareBadReplicasRequest>): DeclareBadReplicasError | undefined {
        if (!requestModel.dids || requestModel.dids.length === 0) {
            return {
                status: 'error',
                name: 'ValidationError',
                message: 'At least one DID must be supplied.',
                code: 400,
            } as DeclareBadReplicasError;
        }
        if (!requestModel.rse || requestModel.rse.trim().length === 0) {
            return { status: 'error', name: 'ValidationError', message: 'RSE is required.', code: 400 } as DeclareBadReplicasError;
        }
        if (!requestModel.reason || requestModel.reason.trim().length === 0) {
            return { status: 'error', name: 'ValidationError', message: 'A reason is required.', code: 400 } as DeclareBadReplicasError;
        }
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<DeclareBadReplicasRequest>): Promise<DeclareBadReplicasDTO> {
        const { rucioAuthToken, dids, rse, reason, expiresAt } = requestModel;
        return this.gateway.declareBadReplicas(rucioAuthToken, dids, rse, reason, expiresAt ?? null);
    }

    handleGatewayError(error: DeclareBadReplicasDTO): DeclareBadReplicasError {
        return {
            status: 'error',
            message: error.errorMessage ?? 'Gateway Error',
            name: error.errorName ?? 'Gateway Error',
            code: error.errorCode ?? 500,
        } as DeclareBadReplicasError;
    }

    processDTO(dto: DeclareBadReplicasDTO): { data: DeclareBadReplicasResponse | DeclareBadReplicasError; status: 'success' | 'error' } {
        const responseModel: DeclareBadReplicasResponse = {
            status: 'success',
            notDeclared: dto.notDeclared,
        };
        return { status: 'success', data: responseModel };
    }
}
