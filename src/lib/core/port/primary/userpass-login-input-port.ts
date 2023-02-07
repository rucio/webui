import { injectable } from "inversify";
import { UserpassLoginRequest } from "../../data/userpass-login";


@injectable()
export default interface UserPassLoginInputPort {
    execute(request: UserpassLoginRequest ): void;
}