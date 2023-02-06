export default interface UserPassLoginInputPort {
    execute(
        username: string, 
        password: string, 
        account: string, 
        response: any, 
        redirectTo?: string
    ): Promise<void>;
}