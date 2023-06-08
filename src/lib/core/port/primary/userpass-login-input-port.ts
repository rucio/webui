import { UserpassLoginRequest } from "../../data/usecase-models/userpass-login-usecase-models";

/**
 * InputPort for UserPassLogin workflow. This is implemented by {@link UserPassLoginUseCase}
 */
export default interface UserPassLoginInputPort {
    execute(request: UserpassLoginRequest ): void;
}
