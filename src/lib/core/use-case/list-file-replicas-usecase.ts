import { injectable } from 'inversify';
import { BaseSingleEndpointStreamingUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import {
    ListFileReplicasError,
    ListFileReplicasRequest,
    ListFileReplicasResponse,
} from '@/lib/core/usecase-models/list-file-replicas-usecase-models';
import { ListFileReplicasInputPort, type ListFileReplicasOutputPort } from '@/lib/core/port/primary/list-file-replicas-ports';
import { FileReplicaStateViewModel } from '@/lib/infrastructure/data/view-model/did';

import { ListReplicasDTO } from '@/lib/core/dto/replica-dto';
import { FileReplicaStateDTO } from '@/lib/core/dto/replica-dto';
import type ReplicaGatewayOutputPort from '@/lib/core/port/secondary/replica-gateway-output-port';

const DOMAINS: string[] = ['wan', 'lan', 'all'];
const SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*$/i;

@injectable()
export default class ListFileReplicasUseCase
    extends BaseSingleEndpointStreamingUseCase<
        AuthenticatedRequestModel<ListFileReplicasRequest>,
        ListFileReplicasResponse,
        ListFileReplicasError,
        ListReplicasDTO,
        FileReplicaStateDTO,
        FileReplicaStateViewModel
    >
    implements ListFileReplicasInputPort
{
    constructor(protected readonly presenter: ListFileReplicasOutputPort, private readonly gateway: ReplicaGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<ListFileReplicasRequest>): ListFileReplicasError | undefined {
        const { domain, schemes } = requestModel;
        // Rucio silently ignores an unknown domain and returns no PFNs, so reject it here
        if (domain !== undefined && !DOMAINS.includes(domain)) {
            return {
                status: 'error',
                code: 400,
                name: 'Invalid Domain',
                message: `Domain must be one of ${DOMAINS.join(', ')}`,
                errorType: 'invalid_domain',
            };
        }
        const invalidScheme = (schemes ?? []).find(scheme => !SCHEME_PATTERN.test(scheme));
        if (invalidScheme !== undefined) {
            return {
                status: 'error',
                code: 400,
                name: 'Invalid Scheme',
                message: `'${invalidScheme}' is not a protocol scheme such as root or davs`,
                errorType: 'invalid_scheme',
            };
        }
        return undefined;
    }

    async intializeRequest(
        request: AuthenticatedRequestModel<AuthenticatedRequestModel<ListFileReplicasRequest>>,
    ): Promise<ListFileReplicasError | undefined> {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListFileReplicasRequest>): Promise<ListReplicasDTO> {
        const { rucioAuthToken, scope, name, schemes, domain, rseExpression, allStates, clientIp } = requestModel;
        const dto: ListReplicasDTO = await this.gateway.listFileReplicas(rucioAuthToken, scope, name, {
            schemes: schemes?.map(scheme => scheme.toLowerCase()),
            domain: domain,
            rseExpression: rseExpression?.trim() || undefined,
            allStates: allStates,
            clientIp: clientIp,
        });
        return dto;
    }

    /**
     * Route every gateway error through {@link handleGatewayError}, so 401 and 500 responses
     * (normally handled generically) get a typed errorType too.
     */
    processGatewayResponse(response: ListReplicasDTO): ListFileReplicasError | undefined {
        if (response.status !== 'success') {
            return this.handleGatewayError(response);
        }
        return super.processGatewayResponse(response);
    }

    handleGatewayError(error: ListReplicasDTO): ListFileReplicasError {
        const base = {
            status: 'error' as const,
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: error.errorClass ?? 'Gateway Error',
        };
        if (error.errorCode === 401) {
            return { ...base, code: 401, errorType: 'unauthorized' };
        }
        // Rucio answers 500 for an invalid or empty RSE expression, but it is a bad request from the user
        if (error.errorClass === 'InvalidRSEExpression') {
            return { ...base, code: 400, errorType: 'invalid_rse_expression' };
        }
        if (error.errorCode === 503) {
            return { ...base, code: 503, errorType: 'server_busy' };
        }
        return { ...base, code: error.errorCode ?? 500, errorType: 'unknown' };
    }

    processStreamedData(dto: FileReplicaStateDTO): { data: ListFileReplicasResponse | ListFileReplicasError; status: 'success' | 'error' } {
        if (dto.status === 'error') {
            const errorModel: ListFileReplicasError = {
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

        const responseModel: ListFileReplicasResponse = {
            ...dto,
            status: 'success',
        };
        return {
            status: 'success',
            data: responseModel,
        };
    }
}
