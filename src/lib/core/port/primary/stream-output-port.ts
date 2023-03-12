export default interface StreamOutputPort<T> {
    response: T;
    presentData(data: T): void;
    presentError(error: Error): void;
}