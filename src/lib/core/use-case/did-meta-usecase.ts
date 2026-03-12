import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { injectable } from 'inversify';
import { DIDMetaDTO } from '../dto/did-dto';
import { DIDMetaInputPort, type DIDMetaOutputPort } from '../port/primary/did-meta-ports';
import type DIDGatewayOutputPort from '../port/secondary/did-gateway-output-port';
import { DIDMetaError, DIDMetaRequest, DIDMetaResponse } from '../usecase-models/did-meta-usecase-models';

@injectable()
class DIDMetaUseCase
    extends BaseSingleEndpointUseCase<AuthenticatedRequestModel<DIDMetaRequest>, DIDMetaResponse, DIDMetaError, DIDMetaDTO>
    implements DIDMetaInputPort
{
    constructor(protected readonly presenter: DIDMetaOutputPort, private readonly gateway: DIDGatewayOutputPort) {
        super(presenter);
    }
    validateRequestModel(requestModel: AuthenticatedRequestModel<DIDMetaRequest>): DIDMetaError | undefined {
        if (requestModel.scope === '' || requestModel.scope === undefined) {
            return {
                error: 'INVALID_REQUEST',
                message: 'Scope is required',
            } as DIDMetaError;
        }
        if (requestModel.did === '' || requestModel.did === undefined) {
            return {
                error: 'INVALID_REQUEST',
                message: 'DID is required',
            } as DIDMetaError;
        }
        if (requestModel.rucioAuthToken === '' || requestModel.rucioAuthToken === undefined) {
            return {
                error: 'INVALID_AUTH',
                message: 'Auth token is required',
            } as DIDMetaError;
        }
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<DIDMetaRequest>): Promise<DIDMetaDTO> {
        const dto: DIDMetaDTO = await this.gateway.getDIDMeta(requestModel.rucioAuthToken, requestModel.scope, requestModel.did);
        return dto;
    }

    handleGatewayError(error: DIDMetaDTO): DIDMetaError {
        return {
            status: 'error',
            error: error.errorMessage,
        } as DIDMetaError;
    }

    processDTO(dto: DIDMetaDTO): { data: DIDMetaResponse | DIDMetaError; status: 'success' | 'error' } {
        return {
            data: {
                status: 'success',
                name: dto.name,
                scope: dto.scope,
                account: dto.account,
                did_type: dto.did_type,
                created_at: dto.created_at,
                updated_at: dto.updated_at,
                availability: dto.availability,
                obsolete: dto.obsolete,
                hidden: dto.hidden,
                suppressed: dto.suppressed,
                purge_replicas: dto.purge_replicas,
                monotonic: dto.monotonic,
                // only for collections
                is_open: dto.is_open,
                // only for files
                adler32: dto.adler32,
                md5: dto.md5,
                guid: dto.guid,
                bytes: dto.bytes,
                is_opendata: dto.is_opendata,
            },
            status: 'success',
        };
    }
}

export default DIDMetaUseCase;
