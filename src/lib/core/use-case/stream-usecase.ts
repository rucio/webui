import { RSEOld } from "../entity/rucio";
import StreamInputPort from "../port/primary/stream-input-port";
import type StreamOutputPort from "../port/primary/stream-output-port";
import StreamGatewayOutputPort from "../port/secondary/stream-gateway-output-port";

export default class StreamUseCase implements StreamInputPort<RSEOld> {
    bufferedData: RSEOld[];
    presenter: StreamOutputPort<any>;
    streamGateway: StreamGatewayOutputPort
    
    constructor(presenter: StreamOutputPort<any>, streamGateway: StreamGatewayOutputPort) {
        this.presenter = presenter;
        this.streamGateway = streamGateway;
        this.bufferedData = [];
    }
    createPipeline(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    prepareData(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    writeToStream(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}