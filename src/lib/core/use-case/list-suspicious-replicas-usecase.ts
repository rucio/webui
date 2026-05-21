import { injectable } from 'inversify';
import { Readable, PassThrough, Transform } from 'stream';
import { BaseStreamingUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseViewModel } from '@/lib/sdk/view-models';

import {
    ListSuspiciousReplicasError,
    ListSuspiciousReplicasRequest,
    ListSuspiciousReplicasResponse,
} from '@/lib/core/usecase-models/list-suspicious-replicas-usecase-models';
import { ListSuspiciousReplicasInputPort, type ListSuspiciousReplicasOutputPort } from '@/lib/core/port/primary/list-suspicious-replicas-ports';

import { SuspiciousReplicaDTO } from '@/lib/core/dto/replica-dto';
import type ReplicaGatewayOutputPort from '@/lib/core/port/secondary/replica-gateway-output-port';

@injectable()
export default class ListSuspiciousReplicasUseCase
    extends BaseStreamingUseCase<
        ListSuspiciousReplicasRequest,
        ListSuspiciousReplicasResponse,
        ListSuspiciousReplicasError,
        SuspiciousReplicaDTO,
        BaseViewModel
    >
    implements ListSuspiciousReplicasInputPort
{
    constructor(protected readonly presenter: ListSuspiciousReplicasOutputPort, private readonly gateway: ReplicaGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<ListSuspiciousReplicasRequest>): ListSuspiciousReplicasError | undefined {
        return undefined;
    }

    async intializeRequest(requestModel: AuthenticatedRequestModel<ListSuspiciousReplicasRequest>): Promise<ListSuspiciousReplicasError | undefined> {
        return Promise.resolve(undefined);
    }

    async generateSourceStream(requestModel: AuthenticatedRequestModel<ListSuspiciousReplicasRequest>): Promise<{
        status: 'success' | 'error';
        stream?: Transform | Readable | PassThrough | null;
        error?: ListSuspiciousReplicasError;
    }> {
        const { rucioAuthToken, rseExpression, youngerThan, nattempts } = requestModel;
        const dto = await this.gateway.listSuspiciousReplicas(rucioAuthToken, rseExpression, youngerThan, nattempts);

        if (dto.status === 'error') {
            const errorModel: ListSuspiciousReplicasError = {
                status: 'error',
                error: `Gateway returned with ${dto.errorCode}: ${dto.errorMessage}`,
                message: dto.errorMessage ?? 'Gateway Error',
                name: dto.errorName ?? 'Gateway Error',
                code: dto.errorCode ?? 500,
            } as ListSuspiciousReplicasError;
            return { status: 'error', error: errorModel };
        }

        const stream = Readable.from(dto.replicas);
        return { status: 'success', stream };
    }

    processStreamedData(dto: SuspiciousReplicaDTO): {
        data: ListSuspiciousReplicasResponse | ListSuspiciousReplicasError;
        status: 'success' | 'error';
    } {
        if (dto.status === 'error') {
            const errorModel: ListSuspiciousReplicasError = {
                status: 'error',
                code: dto.errorCode ?? 500,
                message: dto.errorMessage ?? 'Could not process the fetched data',
                name: dto.errorName ?? 'Gateway Error',
            } as ListSuspiciousReplicasError;
            return { status: 'error', data: errorModel };
        }

        const responseModel: ListSuspiciousReplicasResponse = {
            status: 'success',
            scope: dto.scope,
            name: dto.name,
            rse: dto.rse,
            rseId: dto.rseId,
            cnt: dto.cnt,
            createdAt: dto.createdAt,
        };
        return { status: 'success', data: responseModel };
    }
}
