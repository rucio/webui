export default interface IUseCaseOutputPort<T> {
    response: T;
    present(message: string): void;
}
