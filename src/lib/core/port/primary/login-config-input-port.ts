/**
 * @interface LoginConfigInputPort to fetch the login page configuration from the backend.
 * This is implemented by {@link LoginConfigUseCase}
 */
export default interface LoginConfigInputPort {
    /**
     * Executes the use case. p.s. There is no RequestModel for this use case.
     */
    execute(): void;
}