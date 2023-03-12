import StreamGatewayOutputPort from "@/lib/core/port/secondary/stream-gateway-output-port";

export default class StreamingGateway<T> implements StreamGatewayOutputPort {
    getTextStream(): NodeJS.ReadableStream {
        throw new Error("Method not implemented.");
    }
    getJSONStream(): NodeJS.ReadableStream {
        throw new Error("Method not implemented.");
    }
    getDataStream(): NodeJS.ReadableStream {
        throw new Error("Method not implemented.");
    }

}
