export default interface StreamGatewayOutputPort {
    getTextStream(): NodeJS.ReadableStream;
    getJSONStream(): NodeJS.ReadableStream;
    /**
     * Stream of Data Transfer Objects (DTOs)
     */
    getDataStream(): NodeJS.ReadableStream;
}