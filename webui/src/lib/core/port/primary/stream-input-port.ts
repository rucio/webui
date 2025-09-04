/**
 * The StreamOutputPort is the interface that the UseCase will use to communicate with the presenter.
 * @type T represents the type of data that the presenter will receive on each push event
 */
export default interface StreamInputPort<T> {
    bufferedData: T[];
    /**
     * Since the UseCase has access to gateways and presenters, it can create the pipeline between them, applying the necessary transformations.
     */
    createPipeline(): Promise<void>;
    /**
     * Gets data from streams provided by gateways and converts DTOs to response models.
     */
    prepareData(): Promise<void>;
    /**
     * Writes response models to a stream that is consumed by the presenter
     */
    writeToStream(): Promise<void>;
}
