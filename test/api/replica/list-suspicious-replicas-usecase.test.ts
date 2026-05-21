/**
 * Unit tests for {@link ListSuspiciousReplicasUseCase}.
 *
 * The gateway and presenter are mocked so each scenario exercises a single
 * code-path through the use case without going through the IoC container.
 *
 * Scenarios:
 *  - happy path: gateway returns a non-empty list → presenter receives one
 *    success response per DTO via the streaming pipeline.
 *  - empty result: gateway returns an empty list → presenter receives no
 *    stream items but the pipeline finishes cleanly.
 *  - error propagation: gateway returns a status='error' DTO → presenter
 *    receives a single error model via `presentError`.
 */

import { Readable, Writable } from 'stream';
import ListSuspiciousReplicasUseCase from '@/lib/core/use-case/list-suspicious-replicas-usecase';
import { SuspiciousReplicaDTO, ListSuspiciousReplicasDTO } from '@/lib/core/dto/replica-dto';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import {
    ListSuspiciousReplicasError,
    ListSuspiciousReplicasRequest,
    ListSuspiciousReplicasResponse,
} from '@/lib/core/usecase-models/list-suspicious-replicas-usecase-models';
import type ReplicaGatewayOutputPort from '@/lib/core/port/secondary/replica-gateway-output-port';
import { ListSuspiciousReplicasOutputPort } from '@/lib/core/port/primary/list-suspicious-replicas-ports';

type Captured = {
    responses: ListSuspiciousReplicasResponse[];
    errors: ListSuspiciousReplicasError[];
    finished: boolean;
};

function makeCapturingPresenter(): { presenter: ListSuspiciousReplicasOutputPort; captured: Captured; sink: Writable } {
    const captured: Captured = { responses: [], errors: [], finished: false };

    const sink = new Writable({
        objectMode: true,
        write(chunk, _enc, cb) {
            if (chunk && chunk.status === 'error') {
                captured.errors.push(chunk as ListSuspiciousReplicasError);
            } else if (chunk && chunk.status === 'success') {
                captured.responses.push(chunk as ListSuspiciousReplicasResponse);
            }
            cb();
        },
    });
    sink.on('finish', () => {
        captured.finished = true;
    });

    const presenter = {
        setupStream(transform: NodeJS.ReadWriteStream) {
            transform.pipe(sink);
        },
        presentError(error: ListSuspiciousReplicasError) {
            captured.errors.push(error);
        },
    } as unknown as ListSuspiciousReplicasOutputPort;

    return { presenter, captured, sink };
}

function makeGatewayReturning(dto: ListSuspiciousReplicasDTO): ReplicaGatewayOutputPort {
    return { listSuspiciousReplicas: jest.fn().mockResolvedValue(dto) } as unknown as ReplicaGatewayOutputPort;
}

function makeRequest(): AuthenticatedRequestModel<ListSuspiciousReplicasRequest> {
    return {
        rucioAuthToken: 'token',
        rseExpression: undefined,
        youngerThan: undefined,
        nattempts: undefined,
    } as AuthenticatedRequestModel<ListSuspiciousReplicasRequest>;
}

const successDTO = (replicas: SuspiciousReplicaDTO[]): ListSuspiciousReplicasDTO => ({
    status: 'success',
    replicas,
});

const sampleReplica: SuspiciousReplicaDTO = {
    status: 'success',
    scope: 'test',
    name: 'file.dat',
    rse: 'MOCK',
    rseId: '00000000000000000000000000000001',
    cnt: 3,
    createdAt: 'Wed, 18 Mar 2026 09:08:23 UTC',
};

async function waitForSinkFinish(sink: Writable): Promise<void> {
    if ((sink as any).writableFinished) return;
    await new Promise<void>(resolve => sink.once('finish', () => resolve()));
}

describe('ListSuspiciousReplicasUseCase', () => {
    it('happy path — streams one response per replica returned by the gateway', async () => {
        const gateway = makeGatewayReturning(successDTO([sampleReplica, { ...sampleReplica, name: 'other.dat', cnt: 7 }]));
        const { presenter, captured, sink } = makeCapturingPresenter();
        const useCase = new ListSuspiciousReplicasUseCase(presenter, gateway);

        await useCase.execute(makeRequest());
        await waitForSinkFinish(sink);

        expect(gateway.listSuspiciousReplicas).toHaveBeenCalledTimes(1);
        expect(captured.errors).toHaveLength(0);
        expect(captured.responses).toHaveLength(2);
        expect(captured.responses[0]).toMatchObject({ status: 'success', rse: 'MOCK', name: 'file.dat', cnt: 3 });
        expect(captured.responses[1]).toMatchObject({ name: 'other.dat', cnt: 7 });
    });

    it('empty result — gateway returns no replicas; pipeline finishes with no items', async () => {
        const gateway = makeGatewayReturning(successDTO([]));
        const { presenter, captured, sink } = makeCapturingPresenter();
        const useCase = new ListSuspiciousReplicasUseCase(presenter, gateway);

        await useCase.execute(makeRequest());
        await waitForSinkFinish(sink);

        expect(captured.responses).toHaveLength(0);
        expect(captured.errors).toHaveLength(0);
        expect(captured.finished).toBe(true);
    });

    it('error propagation — gateway returns an error DTO; presenter receives a single error model', async () => {
        const gateway = makeGatewayReturning({
            status: 'error',
            replicas: [],
            errorCode: 503,
            errorName: 'GatewayUnavailable',
            errorMessage: 'upstream is down',
            errorType: 'gateway_endpoint_error',
        } as ListSuspiciousReplicasDTO);
        const { presenter, captured } = makeCapturingPresenter();
        const useCase = new ListSuspiciousReplicasUseCase(presenter, gateway);

        await useCase.execute(makeRequest());

        expect(captured.errors).toHaveLength(1);
        expect(captured.errors[0]).toMatchObject({ status: 'error', code: 503, name: 'GatewayUnavailable' });
        expect(captured.responses).toHaveLength(0);
    });

    it('processStreamedData converts a DTO into a success response model', () => {
        const gateway = makeGatewayReturning(successDTO([]));
        const { presenter } = makeCapturingPresenter();
        const useCase = new ListSuspiciousReplicasUseCase(presenter, gateway);

        const result = useCase.processStreamedData(sampleReplica);
        expect(result.status).toBe('success');
        expect(result.data).toMatchObject({ status: 'success', rse: 'MOCK', cnt: 3 });
    });

    it('processStreamedData converts an error DTO into an error model', () => {
        const gateway = makeGatewayReturning(successDTO([]));
        const { presenter } = makeCapturingPresenter();
        const useCase = new ListSuspiciousReplicasUseCase(presenter, gateway);

        const result = useCase.processStreamedData({
            status: 'error',
            scope: '',
            name: '',
            rse: '',
            rseId: '',
            cnt: 0,
            createdAt: '',
            errorCode: 502,
            errorName: 'BadGateway',
            errorMessage: 'oops',
        } as unknown as SuspiciousReplicaDTO);

        expect(result.status).toBe('error');
        expect(result.data).toMatchObject({ status: 'error', code: 502, name: 'BadGateway' });
    });

    // Ensure the Readable.from(...) used as the source stream emits to the pipeline.
    it('streams arrays via Readable.from when the gateway returns multiple items', async () => {
        const items: SuspiciousReplicaDTO[] = Array.from({ length: 5 }, (_, i) => ({
            ...sampleReplica,
            name: `file_${i}.dat`,
            cnt: i,
        }));
        const gateway = makeGatewayReturning(successDTO(items));
        const { presenter, captured, sink } = makeCapturingPresenter();
        const useCase = new ListSuspiciousReplicasUseCase(presenter, gateway);

        await useCase.execute(makeRequest());
        await waitForSinkFinish(sink);

        expect(captured.responses.map(r => r.cnt)).toEqual([0, 1, 2, 3, 4]);
    });

    it('does not error if Readable.from is called with an empty array', async () => {
        const gateway = makeGatewayReturning(successDTO([]));
        const { presenter, sink } = makeCapturingPresenter();
        const useCase = new ListSuspiciousReplicasUseCase(presenter, gateway);

        const src = Readable.from([]);
        await new Promise<void>(resolve => {
            src.on('end', resolve);
            src.resume();
        });

        await useCase.execute(makeRequest());
        await waitForSinkFinish(sink);
    });
});
