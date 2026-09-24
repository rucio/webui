import { injectable } from 'inversify';
import { PassThrough, Readable, Transform, Writable } from 'stream';
import type { ListDIDsInputPort, ListDIDsOutputPort } from '@/lib/core/port/primary/list-dids-ports';
import type DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';
import { DIDExtendedDTO, ListDIDDTO, ListDIDsStreamData } from '../../dto/did-dto';
import {
    ListDIDsError,
    ListDIDsNoticeCode,
    ListDIDsProgressState,
    ListDIDsRequest,
    ListDIDsResponse,
} from '../../usecase-models/list-dids-usecase-models';
import { isStreamEmpty } from '@/lib/sdk/utils';
import { parseDIDString } from '@/lib/common/did-utils';
import { BaseSingleEndpointPostProcessingPipelineStreamingUseCase, BaseSingleEndpointStreamingUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import GetDIDsPipelineElement from './pipeline-element-get-did';
import { DID, DIDType } from '../../entity/rucio';

@injectable()
class ListDIDsUseCase
    extends BaseSingleEndpointPostProcessingPipelineStreamingUseCase<
        ListDIDsRequest,
        ListDIDsResponse,
        ListDIDsError,
        ListDIDDTO,
        DIDExtendedDTO,
        ListDIDsViewModel
    >
    implements ListDIDsInputPort
{
    constructor(protected presenter: ListDIDsOutputPort, private didGateway: DIDGatewayOutputPort) {
        const getDIDPipelineElement = new GetDIDsPipelineElement(didGateway);
        super(presenter, [getDIDPipelineElement]);
        this.didGateway = didGateway;
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<ListDIDsRequest>): ListDIDsError | undefined {
        let scope: string;
        let name: string;
        try {
            const didComponents = parseDIDString(requestModel.query);
            scope = didComponents.scope;
            name = didComponents.name;
        } catch (error: any) {
            return {
                status: 'error',
                error: 'Invalid DID Query',
                message: (error as Error).message,
            } as ListDIDsError;
        }
    }

    async intializeRequest(request: AuthenticatedRequestModel<ListDIDsRequest>): Promise<ListDIDsError | undefined> {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListDIDsRequest>): Promise<ListDIDDTO> {
        const { scope, name } = parseDIDString(requestModel.query);
        const listDIDDTO: ListDIDDTO = await this.didGateway.listDIDs(
            requestModel.rucioAuthToken,
            scope,
            name,
            requestModel.type,
            requestModel.filters,
        );
        return listDIDDTO;
    }

    /** Ranked order for ALL. Containers and datasets race; files are a last resort. */
    private static readonly COLLECTION_TYPES = [DIDType.CONTAINER, DIDType.DATASET];

    private progressRecord(types: DIDType[], state: ListDIDsProgressState): ListDIDsResponse {
        return {
            status: 'success',
            kind: 'progress',
            progress: { types, state },
        } as ListDIDsResponse;
    }

    private noticeRecord(code: ListDIDsNoticeCode, message: string): ListDIDsResponse {
        return {
            status: 'success',
            kind: 'notice',
            notice: { code, message },
        } as ListDIDsResponse;
    }

    /**
     * The client-facing response the presenter writes to, when it exposes one.
     * Used to abandon the cascade if the client goes away mid-search.
     */
    private consumerResponse(): Writable | undefined {
        return (this.presenter as unknown as { response?: Writable }).response;
    }

    /**
     * Whether anyone is still listening. A client that navigated away must not cost
     * us the file query, which is the expensive hop.
     */
    private isConsumerAlive(): boolean {
        const response = this.consumerResponse();
        if (!response) return true;
        return !response.destroyed && !response.writableEnded;
    }

    /**
     * Fetches one typed hop. Returns the endpoint stream, or the error DTO if the
     * request itself failed. fetch() resolves without consuming the body, so a bad
     * status is available before any data is committed to the response.
     */
    private async fetchHop(
        requestModel: AuthenticatedRequestModel<ListDIDsRequest>,
        type: DIDType,
    ): Promise<{ stream?: Transform | null; error?: ListDIDsError }> {
        const { scope, name } = parseDIDString(requestModel.query);
        const dto = await this.didGateway.listDIDs(requestModel.rucioAuthToken, scope, name, type, requestModel.filters);
        const error = this.processGatewayResponse(dto);
        if (error) return { error };
        return { stream: dto.stream as Transform };
    }

    /**
     * ALL searches containers and datasets concurrently, then files only if both
     * miss and the name has no wildcard. The PassThrough is returned to the caller
     * immediately so progress reaches the client while the cascade is still running.
     */
    async generateSourceStream(requestModel: AuthenticatedRequestModel<ListDIDsRequest>): Promise<{
        status: 'success' | 'error';
        stream?: Transform | Readable | PassThrough | null;
        error?: ListDIDsError;
    }> {
        if (requestModel.type !== DIDType.ALL) {
            return super.generateSourceStream(requestModel);
        }

        const [containerHop, datasetHop] = await Promise.all([
            this.fetchHop(requestModel, DIDType.CONTAINER),
            this.fetchHop(requestModel, DIDType.DATASET),
        ]);

        // Only the container hop's failure can still become an HTTP status, because
        // nothing has been written to the response yet.
        if (containerHop.error) {
            datasetHop.stream?.destroy();
            return { status: 'error', error: containerHop.error };
        }

        const out = new PassThrough({ objectMode: true });

        // pipe() does not propagate a destroyed destination back to its source, so a
        // client disconnect would otherwise leave the cascade running to completion.
        this.consumerResponse()?.once('close', () => {
            if (!out.destroyed) out.destroy();
        });

        this.driveCascade(requestModel, out, containerHop.stream ?? null, datasetHop).catch(() => {
            out.end();
        });

        return { status: 'success', stream: out };
    }

    private async driveCascade(
        requestModel: AuthenticatedRequestModel<ListDIDsRequest>,
        out: PassThrough,
        containerStream: Transform | null,
        datasetHop: { stream?: Transform | null; error?: ListDIDsError },
    ): Promise<void> {
        const isAlive = () => !out.destroyed && !out.writableEnded && this.isConsumerAlive();

        const win = (stream: Transform, type: DIDType, loser?: Transform | null) => {
            loser?.destroy();
            out.write(this.progressRecord([type], 'found'));
            stream.pipe(out);
        };

        out.write(this.progressRecord(ListDIDsUseCase.COLLECTION_TYPES, 'searching'));

        if (containerStream && !(await isStreamEmpty(containerStream))) {
            if (!isAlive()) {
                containerStream.destroy();
                datasetHop.stream?.destroy();
                return;
            }
            win(containerStream, DIDType.CONTAINER, datasetHop.stream);
            return;
        }
        containerStream?.destroy();

        if (datasetHop.stream && !datasetHop.error && !(await isStreamEmpty(datasetHop.stream))) {
            if (!isAlive()) {
                datasetHop.stream.destroy();
                return;
            }
            win(datasetHop.stream, DIDType.DATASET);
            return;
        }
        datasetHop.stream?.destroy();

        if (!isAlive()) return;
        out.write(this.progressRecord(ListDIDsUseCase.COLLECTION_TYPES, 'empty'));

        const { name } = parseDIDString(requestModel.query);
        if (name.includes('*')) {
            out.write(this.noticeRecord('refine-wildcard', 'Please refine the DID name. Wildcard searches on files are not supported.'));
            out.end();
            return;
        }

        out.write(this.progressRecord([DIDType.FILE], 'searching'));

        const fileHop = await this.fetchHop(requestModel, DIDType.FILE);
        if (!isAlive()) {
            fileHop.stream?.destroy();
            return;
        }
        if (fileHop.error || !fileHop.stream) {
            out.write(this.noticeRecord('no-results', 'No DIDs matched this query.'));
            out.end();
            return;
        }

        if (await isStreamEmpty(fileHop.stream)) {
            fileHop.stream.destroy();
            out.write(this.progressRecord([DIDType.FILE], 'empty'));
            out.write(this.noticeRecord('no-results', 'No DIDs matched this query.'));
            out.end();
            return;
        }

        if (!isAlive()) {
            fileHop.stream.destroy();
            return;
        }
        win(fileHop.stream, DIDType.FILE);
    }

    handleGatewayError(error: ListDIDDTO): ListDIDsError {
        let errorType = 'Unknown Error';
        const message = error.errorMessage;
        if (message === 'Invalid Auth Token') {
            errorType = 'Invalid Request';
        } else if (message !== 'Unknown Error') {
            errorType = 'Invalid DID Query';
        }
        return {
            error: errorType,
            message: `${error.errorCode}: ${error.errorMessage}`,
        } as ListDIDsError;
    }

    processStreamedData(dto: DID): { data: ListDIDsResponse | ListDIDsError; status: 'success' | 'error' } {
        // Progress and notice records are minted by the cascade driver, not by the
        // gateway. They carry no scope or name and must travel the pipeline as they are.
        const record = dto as unknown as ListDIDsResponse;
        if (record.kind && record.kind !== 'did') {
            return {
                data: record,
                status: 'success',
            };
        }

        const errorModel: ListDIDsError = {
            status: 'error',
            code: 400,
            error: 'Invalid DID Query',
            message: 'Gateway recieved an invalid (undefined) DID for the query',
            name: 'Gateway Error: Undefined DID in stream',
        };
        if (dto.name === undefined) {
            return {
                status: 'error',
                data: errorModel,
            };
        }
        const responseModel: ListDIDsResponse = {
            status: 'success',
            name: dto.name,
            scope: dto.scope,
            did_type: dto.did_type,
            length: 0,
            bytes: 0,
            open: false, // This is updated in the pipeline element that follows this usecase
        };
        return {
            data: responseModel,
            status: 'success',
        };
    }

    validateFinalResponseModel(responseModel: ListDIDsResponse): { isValid: boolean; errorModel?: ListDIDsError | undefined } {
        return {
            isValid: true,
        };
    }
}

export default ListDIDsUseCase;
