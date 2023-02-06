import UserPassLoginInputPort from "../port/primary/userpass-login-input-port";

class UserpassLoginUseCase implements UserPassLoginInputPort {
    async execute(
        username: string, 
        password: string, 
        account: string, 
        response: any, 
        redirectTo?: string
    ): Promise<void> {
        // ...
    }
}