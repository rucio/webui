export default interface UserPassLoginInputPort {
    execute(
        username: string, 
        password: string, 
        account: string, 
    ): void;
}