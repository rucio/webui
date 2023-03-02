import { UserpassLoginRequest } from "../../data/userpass-login";

/**
 * InputPort for UserPassLogin workflow. This is implemented by {@link UserPassLoginUseCase}
 */
export default interface UserPassLoginInputPort {
    execute(request: UserpassLoginRequest ): void;
}
