import LoginConfigInputPort from "@/lib/core/port/primary/login-config-input-port";
import { inject, injectable } from "inversify";
import { IronSession } from "iron-session";
import { NextApiResponse } from "next";
import USECASE_FACTORY from "@/lib/infrastructure/config/ioc/ioc-symbols-usecase-factory";

export interface ILoginConfigController {
    getLoginViewModel(session: IronSession, response: NextApiResponse): void;
}


@injectable()
class LoginConfigController implements ILoginConfigController {
    private loginConfigUseCase: LoginConfigInputPort | null = null;
    private loginConfigUseCaseFactory: (session: IronSession, response: NextApiResponse) => LoginConfigInputPort;

    public constructor(
        @inject(USECASE_FACTORY.LOGIN_CONFIG) loginConfigUseCaseFactory: (session: IronSession, response: NextApiResponse) => LoginConfigInputPort,
        ) {
        this.loginConfigUseCaseFactory = loginConfigUseCaseFactory;
    }

    async getLoginViewModel(session: IronSession, response: NextApiResponse) {
        this.loginConfigUseCase = this.loginConfigUseCaseFactory(session, response);
        await this.loginConfigUseCase.execute();
    }
}

export default LoginConfigController
