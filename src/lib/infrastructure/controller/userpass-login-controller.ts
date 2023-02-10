import { UserpassLoginRequest } from "@/lib/core/data/userpass-login";
import UserPassLoginInputPort from "@/lib/core/port/primary/userpass-login-input-port";
import { inject, injectable } from "inversify";
import { NextApiResponse } from "next";
import USECASE_FACTORY from "../config/ioc/ioc-symbols-usecase-factory";

/**
 * Declares an interface to initiate the UserPassLogin workflow via the {@link UserPassLoginUseCase}
 */
export interface IUserPassLoginController {
    handle(username: string, password: string, account: string, response: NextApiResponse, redirectTo: string): void;
}

/**
 * Provides an implementation of the {@link UserPassLoginController} interface.
 */
@injectable()
class UserPassLoginController implements IUserPassLoginController {
    private useCase: UserPassLoginInputPort | null = null;
    private useCaseFactory: (response: NextApiResponse) => UserPassLoginInputPort;
    
    public constructor(
        @inject(USECASE_FACTORY.USERPASS_LOGIN) useCaseFactory: (response: NextApiResponse) => UserPassLoginInputPort,
      ) {
        this.useCaseFactory = useCaseFactory;
      }

    async handle(username: string, password: string, account: string, response: NextApiResponse, redirectTo: string) {
        this.useCase = this.useCaseFactory(response);
        const requestModel: UserpassLoginRequest = {
            username: username,
            password: password,
            account: 'ddmlab',
            redirectTo: redirectTo,
        }
        await this.useCase.execute(requestModel);
    }
}

export default UserPassLoginController