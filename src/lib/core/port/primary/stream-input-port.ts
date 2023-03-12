import { RSEDTO } from "../../data/rucio-dto";

export default interface StreamInputPort<T> extends NodeJS.ReadableStream {
    bufferedData: T[];
    /**
     * Gets data from streams provided by gateways and converts DTOs to response models.
     */
    prepareData(): Promise<void>;
    /**
     * Writes response models to a stream that is consumed by the presenter
     */
    writeToStream(): Promise<void>;

}