import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import {
    GetFileReplicasMetalinkError,
    GetFileReplicasMetalinkRequest,
    GetFileReplicasMetalinkResponse,
} from '@/lib/core/usecase-models/get-file-replicas-metalink-usecase-models';
import { GetFileReplicasMetalinkInputPort, type GetFileReplicasMetalinkOutputPort } from '@/lib/core/port/primary/get-file-replicas-metalink-ports';
import { FileReplicasMetalinkDTO } from '@/lib/core/dto/replica-dto';
import type ReplicaGatewayOutputPort from '@/lib/core/port/secondary/replica-gateway-output-port';
import { normalizeFileReplicasOptions, toFileReplicasError, validateFileReplicasOptions } from '@/lib/core/utils/file-replicas-utils';

@injectable()
export default class GetFileReplicasMetalinkUseCase
    extends BaseSingleEndpointUseCase<
        AuthenticatedRequestModel<GetFileReplicasMetalinkRequest>,
        GetFileReplicasMetalinkResponse,
        GetFileReplicasMetalinkError,
        FileReplicasMetalinkDTO
    >
    implements GetFileReplicasMetalinkInputPort
{
    constructor(protected readonly presenter: GetFileReplicasMetalinkOutputPort, private readonly gateway: ReplicaGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<GetFileReplicasMetalinkRequest>): GetFileReplicasMetalinkError | undefined {
        const error = validateFileReplicasOptions(requestModel);
        return error ? { status: 'error', ...error } : undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<GetFileReplicasMetalinkRequest>): Promise<FileReplicasMetalinkDTO> {
        const { rucioAuthToken, scope, name } = requestModel;
        return this.gateway.getFileReplicasMetalink(rucioAuthToken, scope, name, normalizeFileReplicasOptions(requestModel));
    }

    /**
     * Route every gateway error through {@link handleGatewayError}, so 401 and 500 responses
     * (normally handled generically) get a typed errorType too.
     */
    processGatewayResponse(response: FileReplicasMetalinkDTO): GetFileReplicasMetalinkResponse | GetFileReplicasMetalinkError {
        if (response.status !== 'success') {
            return this.handleGatewayError(response);
        }
        return super.processGatewayResponse(response);
    }

    handleGatewayError(error: FileReplicasMetalinkDTO): GetFileReplicasMetalinkError {
        return { status: 'error', ...toFileReplicasError(error) };
    }

    processDTO(dto: FileReplicasMetalinkDTO): {
        data: GetFileReplicasMetalinkResponse | GetFileReplicasMetalinkError;
        status: 'success' | 'error';
    } {
        return { status: 'success', data: { status: 'success', xml: dto.xml } };
    }
}
