import { injectable } from "inversify";
import ListDIDsInputPort from "@/lib/core/port/primary/list-dids-input-port";
import type ListDIDsOutputPort from "@/lib/core/port/primary/list-dids-output-port";
import type DIDGatewayOutputPort from "@/lib/core/port/secondary/did-gateway-output-port";
import { ListDIDDTO } from "../data/dto/did-dto";
import { ListDIDsRequest, ListDIDsResponse } from "../data/usecase-models/list-dids-usecase-models";
import { parseDIDString } from "@/lib/common/did-utils";
import { PassThrough, Transform, TransformCallback } from "node:stream";
import { DIDType } from "../entity/rucio";

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

    _transform(did: Buffer, encoding: BufferEncoding, callback: TransformCallback): void {
        const didName = JSON.parse(did.toString());
        const responseModel: ListDIDsResponse = {
            name: didName,
            scope: didName.split(':')[0],
            did_type: DIDType.DATASET,
            length: 0,
            bytes: 0,
        }
        this.push(JSON.stringify(responseModel));
        callback();
    }

    _flush(callback: TransformCallback): void {
        callback();
    }

}
    
export default ListDIDsUseCase;