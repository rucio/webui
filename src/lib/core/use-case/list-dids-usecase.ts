import { injectable } from "inversify";
import ListDIDsInputPort from "@/lib/core/port/primary/list-dids-input-port";
import type ListDIDsOutputPort from "@/lib/core/port/primary/list-dids-output-port";
import type DIDGatewayOutputPort from "@/lib/core/port/secondary/did-gateway-output-port";
import { ListDIDDTO } from "../data/dto/did-dto";
import { ListDIDsError, ListDIDsRequest, ListDIDsResponse } from "../data/usecase-models/list-dids-usecase-models";
import { parseDIDString } from "@/lib/common/did-utils";
import StreamingUseCase from "@/lib/common/stream/stream-usecase";
import { ListDIDsViewModel } from "@/lib/infrastructure/data/view-model/list-did";
import { PassThrough, Transform, TransformCallback } from "node:stream";
import ListDID from "@/app/did/page";

@injectable()
class ListDIDsUseCase extends Transform implements ListDIDsInputPort {
    constructor(
        private presenter: ListDIDsOutputPort<any>,
        private didGateway: DIDGatewayOutputPort,
    ) {
        super({ objectMode: true });
        this.didGateway = didGateway;
    }

    async execute(request: ListDIDsRequest): Promise<void> {
        let scope: string;
        let name: string;
        try{
            let didComponents = parseDIDString(request.query);
            scope = didComponents.scope;
            name = didComponents.name;
        } catch (error: unknown) {
            await this.presenter.presentError({
                error: 'Invalid DID Query',
                message: error,
            })
            return
        }

        const listDIDDTO: ListDIDDTO = await this.didGateway.listDIDs(request.rucioAuthToken, scope, name, request.type);
        if(listDIDDTO.status === 'error'){
            await this.presenter.presentError({
                error: 'Invalid Request',
                message: listDIDDTO.error,
            })
            return
        }

        if(listDIDDTO.stream === null){
            await this.presenter.presentError({
                error: 'Unknown Error',
                message: 'Failed to stream DIDs.',
            })
            return
        }
        const didStream = listDIDDTO.stream;
        const viewModelStream = new PassThrough();
        didStream.pipe(this).pipe(viewModelStream);
        await this.presenter.presentStream(viewModelStream);
    }

    _transform(did: any, encoding: BufferEncoding, callback: TransformCallback): void {
        this.push(did.toString());
        callback();
    }

    _flush(callback: TransformCallback): void {
        callback();
    }

}
    
export default ListDIDsUseCase;